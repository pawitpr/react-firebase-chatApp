import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Avatar, Chip, Menu, MenuItem, Tooltip } from '@mui/material';
import { Drawer, DrawerHeader, StyledBadge, AppBar } from '../Chat';
import { useUserAuth } from '../../../context/userAuthContext';
import { collection, doc, documentId, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';

export function DrawerWithNav(props) {
  const [open, setOpen] = React.useState(true);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [allUsers, setAllUsers] = React.useState([]);

  const { user, logOut } = useUserAuth();
  console.log({ user });

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logOut();
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    setUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const setUsers = async () => {
    if (user.uid) {
      const q = query(collection(db, 'users'), where(documentId(), '!=', user?.uid));
      onSnapshot(q, (querySnapshot) => {
        let dt = [];
        querySnapshot.docs.map(async (document) => {
          let roomid = [user.uid, document.data().uid].sort();
          roomid = roomid[0] + roomid[1];

          // const q = query(collection(db, 'chats'), where(documentId(), '==', roomid));
          // onSnapshot(q, (qSnapshot) => {
          //   var dtt = qSnapshot.docs.map((doc) => {
          //     // doc.data() is never undefined for query doc snapshots
          //     console.log(' => ', doc.data());
          //     if (doc.data()) {
          //       console.log(' -> ', doc.data());
          //       let roomDetail = doc.data();
          //       let documentData = document.data();
          //       documentData.roomDetail = roomDetail;
          //       // dt.push({ data: documentData });
          //       console.log({documentData});
          //       return {
          //         data: documentData,
          //       };
          //     } else {
          //       console.log('not exist');
          //       dt.push({ data: document.data() });
          //       return {
          //         data: document.data(),
          //       };
          //     }
          //   });
          // });

          const chats_ref = doc(db, 'chats', roomid);
          await getDoc(chats_ref)
            .then((res) => {
              if (res.exists()) {
                console.log(' -> ', res.data());
                let roomDetail = res.data();
                let documentData = document.data();
                documentData.roomDetail = roomDetail;
                dt.push({ data: documentData });
                return {
                  data: documentData,
                };
              } else {
                console.log('not exist');
                dt.push({ data: document.data() });
                return {
                  data: document.data(),
                };
              }
            })
            .catch((err) => {
              console.log('something went wrong', err);
            });
          const arrUniq = [...new Map(dt.map((v) => [v.data.uid, v])).values()];
          console.log({ arrUniq });
          setAllUsers(arrUniq);
        });
      });
    }
  };

  return (
    <Box
      className='wrapper'
      sx={(theme) => ({
        [theme.breakpoints.down('sm')]: {
          position: 'absolute',
        },
      })}
    >
      <Drawer variant='permanent' open={open}>
        <DrawerHeader
          sx={{
            justifyContent: 'flex-start',
            background: '#1976d2',
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            {/* {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />} */}
            <MenuIcon sx={{ color: 'white' }} />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {allUsers?.map((item, index) => {
            const unreadCount = item?.data?.roomDetail
              ? typeof item?.data?.roomDetail[user?.uid]?.unread_count === 'number'
                ? item?.data?.roomDetail[user?.uid]?.unread_count
                : 0
              : 0;
            return (
              <ListItem
                key={index}
                disablePadding
                sx={{
                  display: 'block',
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  onClick={() => {
                    props.handlePersonChat(item);
                    setOpen(false);
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <StyledBadge
                      overlap='circular'
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }} // variant='dot'
                    >
                      <Avatar alt='' src={item?.data?.profile_pictures} />
                    </StyledBadge>
                  </ListItemIcon>
                  <ListItemText
                    primary={item?.data?.displayName?.split(' ')[0]}
                    sx={{
                      opacity: open ? 1 : 0,
                    }}
                  />
                  <Chip
                    label={unreadCount}
                    color={unreadCount > 0 ? 'primary' : 'secondary'}
                    sx={{ display: open ? 'flex' : 'none' }}
                    variant='outlined'
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        {/* <Divider />
          <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
           <ListItem key={text} disablePadding sx={{ display: 'block' }}>
             <ListItemButton
               sx={{
                 minHeight: 48,
                 justifyContent: open ? 'initial' : 'center',
                 px: 2.5,
               }}
             >
               <ListItemIcon
                 sx={{
                   minWidth: 0,
                   mr: open ? 3 : 'auto',
                   justifyContent: 'center',
                 }}
               >
                 {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
               </ListItemIcon>
               <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
             </ListItemButton>
           </ListItem>
          ))}
          </List> */}
      </Drawer>
      <AppBar
        position='fixed'
        open={open}
        sx={(theme) => ({
          boxShadow: 'none',
          [theme.breakpoints.down('sm')]: {
            width: open ? 'calc(100% - 48px)' : '100%',
          },
        })}
      >
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={{
              marginRight: 5,
              ...(open && {
                display: 'none',
              }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box display='flex' justifyContent='space-between' width='100%'>
            <Typography variant='h6' noWrap component='div'>
              Penguins Chat
            </Typography>
            <Box
              sx={{
                flexGrow: 0,
              }}
            >
              <Tooltip title='Open settings'>
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{
                    p: 0,
                  }}
                >
                  <Avatar alt={user.displayName} src={user.photoURL} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{
                  mt: '45px',
                }}
                id='menu-appbar'
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign='center'>{user.displayName}</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    handleLogout();
                  }}
                >
                  <Typography textAlign='center'>Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
