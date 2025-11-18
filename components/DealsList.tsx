"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import useDebounce from "@/hooks/useDebounce";
import track from "@/lib/track";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LIMIT = 20; // number of deals per batch

export default function DealsList({
  selectedStore,
  selectedCategory,
  selectedHoliday,
  showHotDeals = false,
  onSelectDeal,
  searchQuery,
}: any) {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  /* ======================================================
     BUILD SUPABASE QUERY WITH FILTERS
  ====================================================== */
  const buildQuery = () => {
    let query = supabase
      .from("deals")
      .select("*")
      .eq("status", "Published")
      .order("published_at", { ascending: false });

    if (selectedStore && selectedStore !== "Recent Deals") {
      query = query.ilike("store_name", `%${selectedStore}%`);
    }

    if (selectedCategory) {
      query = query.ilike("category", `%${selectedCategory}%`);
    }

    if (selectedHoliday) {
      query = query.eq(
        "holiday_tag",
        selectedHoliday
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c: string) => c.toUpperCase())
      );
    }

    if (showHotDeals) {
      query = query.gte("percent_diff", 30);
    }

    if (debouncedSearch) {
      query = query.or(
        `description.ilike.%${debouncedSearch}%,store_name.ilike.%${debouncedSearch}%,category.ilike.%${debouncedSearch}%`
      );
    }

    return query;
  };

  /* ======================================================
     FETCH FIRST PAGE (RESET WHEN FILTERS CHANGE)
  ====================================================== */
  useEffect(() => {
    const loadFirstPage = async () => {
      setLoading(true);
      setPage(0);
      setHasMore(true);

      const query = buildQuery().range(0, LIMIT - 1);
      const { data, error } = await query;

      if (error || !data) {
        setDeals([]);
      } else {
        // remove duplicates just in case
        const unique = data.filter(
          (item, index, arr) =>
            arr.findIndex((x) => x.id === item.id) === index
        );

        setDeals(unique);
        setHasMore(data.length === LIMIT);
      }

      setLoading(false);
    };

    loadFirstPage();
  }, [
    selectedStore,
    selectedCategory,
    selectedHoliday,
    showHotDeals,
    debouncedSearch,
  ]);

  /* ======================================================
     LOAD MORE DEALS (INFINITE SCROLL)
  ====================================================== */
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    const nextPage = page + 1;
    const from = nextPage * LIMIT;
    const to = from + LIMIT - 1;

    const { data, error } = await buildQuery().range(from, to);

    if (!error && data) {
      setDeals((prev) => {
        const combined = [...prev, ...data];

        // Deduplicate by deal.id
        const unique = combined.filter(
          (item, index, arr) =>
            arr.findIndex((x) => x.id === item.id) === index
        );

        return unique;
      });

      setPage(nextPage);
      setHasMore(data.length === LIMIT);
    }

    setLoadingMore(false);
  };

  /* ======================================================
     SCROLL LISTENER
  ====================================================== */
  useEffect(() => {
    const div = containerRef.current;
    if (!div) return;

    const handleScroll = () => {
      if (loading || loadingMore || !hasMore) return;

      const nearBottom =
        div.scrollTop + div.clientHeight >= div.scrollHeight - 200;

      if (nearBottom) {
        loadMore();
      }
    };

    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, [loading, loadingMore, hasMore, page]);

  /* ======================================================
     UI
  ====================================================== */
  if (loading) return <p className="text-center mt-10">Loading deals...</p>;

  if (!deals.length)
    return <p className="text-center mt-10">No deals found.</p>;

  return (
    <div
      ref={containerRef}
      className="flex flex-col divide-y divide-gray-200 overflow-y-auto h-full custom-scroll"
    >
      {deals.map((deal) => (
        <div
          key={deal.id}
          onClick={() => {
            track({
              event_type: "deal_click",
              deal_id: deal.id,
              page: "/",
              user_agent: navigator.userAgent,
              ip_address: null,
            });

            onSelectDeal(deal);
          }}
          className="flex items-center gap-4 p-3 h-32 hover:bg-gray-100 cursor-pointer transition"
        >
          <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
            {deal.image_link ? (
              <img
                src={deal.image_link}
                alt={deal.description}
                className="w-full h-full object-contain bg-white"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                No Image
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 line-clamp-2">
              {deal.description}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {deal.store_name}
            </p>

            <div className="text-sm text-gray-600 mt-1">
              {deal.current_price && (
                <span className="font-semibold text-green-600">
                  ${deal.current_price.toFixed(2)}
                </span>
              )}
              {deal.old_price && (
                <span className="ml-2 line-through text-gray-400">
                  ${deal.old_price.toFixed(2)}
                </span>
              )}

              {/* Heat Level */}
              {deal.percent_diff >= 70 ? (
                <span className="text-red-600 text-lg">🔥🔥🔥</span>
              ) : deal.percent_diff >= 60 ? (
                <span className="text-orange-500 text-lg">🔥🔥</span>
              ) : deal.percent_diff >= 50 ? (
                <span className="text-amber-500 text-lg">🔥</span>
              ) : deal.percent_diff >= 40 ? (
                <span className="text-yellow-600 text-lg">🌡️</span>
              ) : null}

              {deal.percent_diff && (
                <span className="text-sm font-bold text-green-600">
                  -{deal.percent_diff.toFixed(0)}%
                </span>
              )}
            </div>
          </div>
        </div>
      ))}

      {loadingMore && (
        <div className="p-4 text-center text-gray-500">
          Loading more…
        </div>
      )}
    </div>
  );
}
