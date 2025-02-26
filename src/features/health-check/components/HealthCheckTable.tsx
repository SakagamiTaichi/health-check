import {
  Paper,
  Button,
  Typography,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Box,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { CheckCircle, Error, Refresh, RotateLeft } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import {
  HealthCheckItem,
  checkAllServices,
  performApiHealthCheck,
  performDnsResolutionCheck,
  resetHealthChecks,
} from '../../health-check/slices/healthCheckSlice';

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

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'サービス',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' fontSize={12}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'endpoint',
      headerName: 'エンドポイント',
      flex: 1.5,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' style={{ fontFamily: 'monospace' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'ステータス',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => getStatusChip(params.value),
    },
    {
      field: 'lastCheckedAt',
      headerName: '最終チェック',
      flex: 1,
      // valueGetter: (params) => formatDate(params.value),
    },
    {
      field: 'message',
      headerName: 'メッセージ',
      flex: 1.5,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as HealthCheckItem;
        return (
          <Typography
            variant='body2'
            color={row.status === 'failure' ? 'error' : 'textSecondary'}
            noWrap
          >
            {params.value || '—'}
          </Typography>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'アクション',
      flex: 0.7,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as HealthCheckItem;
        return (
          <Tooltip title='Run check'>
            <IconButton
              color='primary'
              onClick={() => handleCheck(row.id)}
              disabled={row.status === 'pending'}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Box sx={{ padding: '20px' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <Typography variant='h4' component='h1'>
          ヘルスチェックモニタリング
        </Typography>
        <Box>
          <Button
            variant='contained'
            color='primary'
            startIcon={<Refresh />}
            onClick={handleCheckAll}
            sx={{ marginRight: '10px' }}
          >
            全チェック
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            startIcon={<RotateLeft />}
            onClick={handleReset}
          >
            リセット
          </Button>
        </Box>
      </Box>

      <Paper elevation={3} sx={{ width: '1100px' }}>
        <DataGrid
          rows={items}
          columns={columns}
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25 },
            },
          }}
          getRowClassName={(params) => {
            const item = params.row as HealthCheckItem;
            return item.status === 'failure' ? 'error-row' : '';
          }}
          sx={{}}
        />
      </Paper>
    </Box>
  );
};

export default HealthCheckTable;
