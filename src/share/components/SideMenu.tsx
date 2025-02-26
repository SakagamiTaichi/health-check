import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  Home,
  Info,
  ContactMail,
  Settings,
  Help,
  HealthAndSafety,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SideMenu: React.FC = () => {
  const navigate = useNavigate();
  const menuItems = [
    { text: 'Health Check', icon: <HealthAndSafety />, path: '/health-check' },
    { text: 'Todo', icon: <Home />, path: '/todo' },
    { text: 'Counter', icon: <Info />, path: '/counter' },
    { text: 'Contact', icon: <ContactMail />, path: '/contact' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
    { text: 'Help', icon: <Help />, path: '/help' },
  ];

  return (
    <Drawer
      anchor='left'
      variant='permanent'
      sx={{ width: 270, flexShrink: 0, '& .MuiDrawer-paper': { width: 270 } }}
    >
      <List>
        {menuItems.map((item) => {
          return (
            // ページ遷移する onClickに遷移処理を追加
            <ListItemButton key={item.text} onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};

export default SideMenu;
