import React, { useEffect } from 'react';
import HealthCheckTable from '../components/HealthCheckTable';
import { useAppDispatch } from '../../../hooks/hooks';
import { checkAllServices } from '../slices/healthCheckSlice';

const HealthCheckPage: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 初回ロード時に全チェックを実行
    dispatch(checkAllServices());

    // 1分ごとに自動チェック（オプション）
    const interval = setInterval(() => {
      dispatch(checkAllServices());
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return <HealthCheckTable />;
};

export default HealthCheckPage;
