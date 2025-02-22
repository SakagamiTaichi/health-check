import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { Home, Info, ContactMail, Settings, Help } from "@mui/icons-material";

const SideMenu: React.FC = () => {
  const menuItems = [
    { text: "Monitor", icon: <Home /> },
    { text: "About", icon: <Info /> },
    { text: "Contact", icon: <ContactMail /> },
    { text: "Settings", icon: <Settings /> },
    { text: "Help", icon: <Help /> },
  ];

  return (
    <Drawer
      anchor="left"
      variant="permanent"
      sx={{ width: 270, flexShrink: 0, "& .MuiDrawer-paper": { width: 270 } }}
    >
      <List>
        {menuItems.map((item) => {
          return (
            <ListItemButton>
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
