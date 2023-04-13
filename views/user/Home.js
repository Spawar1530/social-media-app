/* eslint-disable react-native/no-inline-styles */
/* eslint-disable comma-dangle */
/* eslint-disable prettier/prettier */
import React, {useState, useContext, useEffect} from 'react';
import {View, StyleSheet, Image, FlatList} from 'react-native';
import {
  Text,
  Card,
  Button,
  Icon,
  SpeedDial,
  Avatar,
  Tooltip,
} from '@rneui/themed';
import CustomSearchBar from '../../components/CustomSearchBar';
import CreateGroupModal from '../../components/CreateGroupModal';
import {useNavigation} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import {AppContext} from '../../utils/context/AppProvider';
import firestore from '@react-native-firebase/firestore';
import debounce from 'lodash.debounce';

// tool tip for showing logout option
const ControlledTooltip = props => {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip
      visible={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      {...props}
    />
  );
};

// group component
const GroupCard = ({group}) => {
  const navigation = useNavigation();

  return (
    <Card>
      <Card.Title style={styles.title}>{group?.name}</Card.Title>
      <Card.Divider />
      <Card.Image
        style={styles.image}
        source={{
          uri: group?.groupBanner,
        }}
      />
      <Text style={styles.content}>{group?.description}</Text>
      <Button
        icon={<Icon name="code" color="#ffffff" iconStyle={styles.icon} />}
        buttonStyle={styles.cardButton}
        title="VIEW NOW"
        onPress={() =>
          group?.isUser
            ? navigation.navigate('JoinedGroupDetails', {
                groupId: group?.id,
                groupName: group?.name,
              })
            : navigation.navigate('GroupDetails', {groupId: group?.id})
        }
      />
    </Card>
  );
};

function Home() {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const {logout, setUser, user} = useContext(AppContext);
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);

  // handle search for seraching the groups
  const handleSearch = debounce(async text => {
    if (text?.length > 0) {
      const db = firestore();
      const querySnapshot = await db
        .collection('groups')
        .where('name', '==', text)
        .get();

      const groupsList = [];

      querySnapshot.forEach(doc => {
        const groupData = doc.data();
        const groupID = doc.id;
        let isUser = groupData?.members.includes(user?.userId);
        groupsList.push({...groupData, id: groupID, isUser});
      });

      setGroups(groupsList);
    } else {
      const query = firestore().collectionGroup('groups');

      query.onSnapshot(querySnapshot => {
        const groupsList = [];

        querySnapshot.forEach(doc => {
          const groupData = doc.data();
          const groupID = doc.id;
          let isUser = groupData?.members.includes(user?.userId);
          groupsList.push({...groupData, id: groupID, isUser});
        });

        setGroups(groupsList);
      });
    }
  }, 1000);

  // clear keychain after successfull logout
  const clearKeychain = async () => {
    try {
      await Keychain.resetInternetCredentials('socialApp');
      console.log('Keychain cleared successfully.');
    } catch (error) {
      console.log('Error clearing keychain:', error);
    }
  };

  // getting the list of all groups on mount of component
  useEffect(() => {
    const query = firestore().collectionGroup('groups');

    const unsubscribe = query.onSnapshot(querySnapshot => {
      const groupsList = [];

      querySnapshot.forEach(doc => {
        const groupData = doc.data();
        const groupID = doc.id;
        let isUser = groupData?.members.includes(user?.userId);
        groupsList.push({...groupData, id: groupID, isUser});
      });

      setGroups(groupsList);
    });

    return () => {
      unsubscribe();
    };
  }, [openDialog, user]);

  return (
    <View style={styles.root}>
      <CreateGroupModal
        openDialog={openDialog}
        toggleDialog={() => setOpenDialog(!openDialog)}
      />
      <SpeedDial
        color="#4974b8"
        style={{zIndex: 100}}
        isOpen={open}
        icon={{name: 'edit', color: '#fff'}}
        openIcon={{name: 'close', color: '#fff'}}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}>
        <SpeedDial.Action
          color="#4974b8"
          icon={{name: 'add', color: '#fff'}}
          title="Create a group"
          onPress={() => {
            setOpenDialog(true);
            setOpen(!open);
          }}
        />
      </SpeedDial>
      <View style={styles.view}>
        <CustomSearchBar
          usedIn="Home"
          placeholder="Search groups..."
          onChange={async text => {
            setSearch(text);
            await handleSearch(text);
          }}
          value={search}
        />
        <ControlledTooltip
          popover={
            <View>
              <Button
                icon={
                  <Icon
                    name="logout"
                    color="#ffffff"
                    type="antdesign"
                    iconStyle={styles.icon}
                  />
                }
                buttonStyle={styles.cardButton}
                title="SIGN OUT"
                onPress={async () => {
                  await logout();
                  await clearKeychain();
                  setUser(null);
                  navigation.navigate('SignIn');
                }}
              />
            </View>
          }
          //width={100}
          height={80}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            elevation: 4,
          }}
          withPointer={false}
          backgroundColor="white">
          <Avatar
            title={user?.name[0]}
            containerStyle={{backgroundColor: 'gray'}}
            rounded
            size={48}
          />
        </ControlledTooltip>
      </View>
      <FlatList
        data={groups}
        renderItem={({item}) => <GroupCard group={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#C9D9EF',
  },
  cardButton: {
    borderRadius: 8,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    backgroundColor: '#ec9d75',
    borderColor: '#A6A1C2',
  },
  icon: {
    marginRight: 10,
  },
  content: {
    color: 'black',
    marginBottom: 10,
  },
  image: {
    padding: 0,
  },
  title: {
    fontSize: 28,
  },
  view: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
