import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import _ from "lodash";
import { getToken } from "@/utills/cookies";
import { setDataToRedux, setPageNumber } from "@/store/slices/game-calendar-slice";
// import {
//   setDataToRedux,
//   setPageNumber,
// } from "src/redux/slices/gameCalenderSlice";

interface useInfiniteScrollArgs {
  url: string;
  query?: { [key: string]: any };
  pageSize?: number;
  enabled?: boolean;
  onError?: (error?: any) => void;
  page?: number | { page: number };
  disableAuthHeader?: boolean;
}

const useInfiniteCalendarScroll = <T = any>({
  url,
  pageSize = 9,
  enabled = true,
  query,
  onError,
  page,
  disableAuthHeader,
}: useInfiniteScrollArgs) => {
  const dispatch = useDispatch();
  const token = getToken();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(undefined);
  const [dataPagination, setDataPagination] = useState<{
    page: number | { page: number };
    pageSize: number;
    pageCount: number;
    total: number;
  }>({
    page: page ? (typeof page === "number" ? page : page?.page) : 1,
    pageSize,
    pageCount: 0,
    total: 0,
  });

  // Fetch data from Redux store
  const gamesFromRedux = useSelector((state: any) => state.gameCalendar.games);
  const gamesPageFromRedux = useSelector(
    (state: any) => state.gameCalendar.pageNumber
  );
  // Intersection observer hook
  const { ref, inView } = useInView();

  // Function to fetch data from API
  const fetchDataFromApi = async (page?: number) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const headers = disableAuthHeader
        ? {}
        : { Authorization: token && `Bearer ${token}` };
      const response = await axios.get(url, {
        params: {
          pagination: {
            page,
            pageSize: dataPagination.pageSize,
          },
          ...query,
        },
        headers,
      });
      const { data: resultsData, results, pagination, meta } = response.data;
      let fetchedPagination = pagination ?? meta?.pagination;
      if (!fetchedPagination) {
        // Handle the case where pagination is not defined in the response
        fetchedPagination = {
          page: 1,
          pageSize: 10,
          pageCount: 1,
          total: 0,
        };
      }
      const uniqueData =
        meta?.pagination?.page === 1 || pagination?.page === 1
          ? results ?? resultsData ?? []
          : _.uniqBy(
              [...gamesFromRedux, ...(results ?? resultsData ?? [])],
              "id"
            );
      dispatch(setDataToRedux(uniqueData)); // Save data to Redux store
      dispatch(setPageNumber(fetchedPagination));
      setDataPagination(pagination ?? meta.pagination);
    } catch (error) {
      setError(error);
      onError && onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const pageNumberOption =
      typeof page === "number" ? page : (page as { page: number })?.page;
    if (
      gamesPageFromRedux == 1 &&
      !inView &&
      pageNumberOption === 1 &&
      !query
    ) {
      fetchDataFromApi(pageNumberOption);
    }
  }, [page == 1, gamesPageFromRedux == 1, inView]);

  useEffect(() => {
    const pageNumberOption =
      typeof page === "number" ? page : (page as { page: number })?.page;
    if (query && enabled && query["filters[title][$containsi]"]) {
      fetchDataFromApi(1);
    }
    if (query && enabled && !query["filters[title][$containsi]"]) {
      fetchDataFromApi(pageNumberOption);
    }
  }, [query, enabled]);

  useEffect(() => {
    // Fetch data from API if inView, there is more data to fetch, and nextPage is available
    const pageNumberOption =
      typeof dataPagination.page === "number"
        ? dataPagination.page
        : gamesPageFromRedux?.page;
    const pageCountOption =
      typeof dataPagination.pageCount === "number" &&
      dataPagination.pageCount !== 0
        ? dataPagination.pageCount
        : gamesPageFromRedux?.pageCount;
    const hasMore = pageNumberOption < pageCountOption;
    const nextPage = pageNumberOption + 1;
    const reduxPage = gamesPageFromRedux?.page
      ? gamesPageFromRedux?.page
      : gamesPageFromRedux;
    if (enabled && inView && hasMore && nextPage && nextPage > reduxPage) {
      fetchDataFromApi(nextPage);
    }
  }, [inView]); // Run this effect when `enabled`, `inView`, `dataPagination`, or `gamesFromRedux` changes

  return {
    ref,
    isLoading,
    error,
    data: gamesFromRedux,
    dataPagination,
  };
};

export default useInfiniteCalendarScroll;
