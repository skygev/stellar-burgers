import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getActivityFeed,
  fetchActivityFeed
} from '../../services/slices/activityFeedSlice';

export const Feed: FC = () => {
  const storeDispatch = useDispatch();
  const feedData = useSelector(getActivityFeed);

  function loadFeedData() {
    storeDispatch(fetchActivityFeed());
  }

  function handleFeedRefresh() {
    storeDispatch(fetchActivityFeed());
  }

  useEffect(loadFeedData, [storeDispatch]);

  if (!feedData.activityData?.orders) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={feedData.activityData.orders}
      handleGetFeeds={handleFeedRefresh}
    />
  );
};
