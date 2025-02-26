import React, { useEffect } from 'react';
import { Container, Paper, Typography } from '@mui/material';
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

  return (
    <Container maxWidth='lg'>
      <Paper elevation={0} sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant='body1' color='textSecondary'>
          This page monitors the health of various services and displays their
          current status. You can manually check each service individually or
          run all checks at once.
        </Typography>
      </Paper>

      <HealthCheckTable />
    </Container>
  );
};

export default HealthCheckPage;
