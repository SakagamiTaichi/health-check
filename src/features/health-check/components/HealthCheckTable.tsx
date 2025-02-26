import React, { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import { CheckCircle, Error, Refresh, RotateLeft } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import {
  HealthCheckItem,
  checkAllServices,
  performApiHealthCheck,
  performDnsResolutionCheck,
  resetHealthChecks,
} from '../../health-check/slices/healthCheckSlice';

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Never';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};

const getStatusChip = (status: HealthCheckItem['status']) => {
  switch (status) {
    case 'success':
      return (
        <Chip
          icon={<CheckCircle />}
          label='Success'
          color='success'
          variant='outlined'
        />
      );
    case 'failure':
      return (
        <Chip
          icon={<Error />}
          label='Failed'
          color='error'
          variant='outlined'
        />
      );
    case 'pending':
      return (
        <Chip
          icon={<CircularProgress size={16} />}
          label='Checking'
          color='primary'
          variant='outlined'
        />
      );
    case 'idle':
    default:
      return <Chip label='Not Checked' color='default' variant='outlined' />;
  }
};

const HealthCheckTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.healthCheck);

  const handleCheck = (id: string) => {
    if (id === 'api-health') {
      dispatch(performApiHealthCheck(id));
    } else if (id === 'dns-resolution') {
      dispatch(performDnsResolutionCheck(id));
    }
  };

  const handleCheckAll = () => {
    dispatch(checkAllServices());
  };

  const handleReset = () => {
    dispatch(resetHealthChecks());
  };

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <Typography variant='h4' component='h1'>
          Health Check Monitoring
        </Typography>
        <div>
          <Button
            variant='contained'
            color='primary'
            startIcon={<Refresh />}
            onClick={handleCheckAll}
            style={{ marginRight: '10px' }}
          >
            Check All
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            startIcon={<RotateLeft />}
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} elevation={3}>
        <Table aria-label='health check table'>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Service
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Endpoint
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Status
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Last Checked
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Message
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                hover
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                  backgroundColor:
                    item.status === 'failure'
                      ? 'rgba(255, 0, 0, 0.05)'
                      : undefined,
                }}
              >
                <TableCell component='th' scope='row'>
                  <Typography variant='body1'>{item.name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant='body2'
                    style={{ fontFamily: 'monospace' }}
                  >
                    {item.endpoint}
                  </Typography>
                </TableCell>
                <TableCell>{getStatusChip(item.status)}</TableCell>
                <TableCell>{formatDate(item.lastCheckedAt)}</TableCell>
                <TableCell>
                  <Typography
                    variant='body2'
                    color={
                      item.status === 'failure' ? 'error' : 'textSecondary'
                    }
                    noWrap
                    style={{ maxWidth: '200px' }}
                  >
                    {item.message || '—'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Tooltip title='Run check'>
                    <IconButton
                      color='primary'
                      onClick={() => handleCheck(item.id)}
                      disabled={item.status === 'pending'}
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default HealthCheckTable;
