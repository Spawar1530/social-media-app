/* eslint-disable prettier/prettier */
import React, {useState, useContext, useEffect} from 'react';
import {View, StyleSheet, FlatList, Dimensions, Keyboard} from 'react-native';
import {Text, Avatar} from '@rneui/themed';
import TopBar from '../../components/TopBar';
import {useNavigation, useRoute} from '@react-navigation/native';
import CustomSearchBar from '../../components/CustomSearchBar';
import MessageInput from '../../components/MessageInput';
import {firebase} from '@react-native-firebase/database';
import {AppContext} from '../../utils/context/AppProvider';
import debounce from 'lodash.debounce';

function JoinedGroupDetails() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const {groupId, groupName} = useRoute().params;
  const {user} = useContext(AppContext);


  // search functionality for searching the messages
  const handleSearch = debounce(async text => {
    if (text?.length > 0) {
      const ref = firebase
        .app()
        .database(
          'https://social-media-app-393c1-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref(`groups/${groupId}/messages`);

      const searchQuery = await ref.orderByChild('text').equalTo(text);

      searchQuery.on('value', snapshot => {
        const messagesArray = [];
        console.log(snapshot);
        snapshot.forEach(childSnapshot => {
          const currentMessage = childSnapshot.val();
          currentMessage.id = childSnapshot.key;
          messagesArray.push(currentMessage);
        });
        setMessages(messagesArray);
      });
    } else {
      const messagesRef = firebase
        .app()
        .database(
          'https://social-media-app-393c1-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('groups/' + groupId + '/messages');
      messagesRef.on('value', snapshot => {
        const messagesArray = [];
        console.log(snapshot);
        snapshot.forEach(childSnapshot => {
          const currentMessage = childSnapshot.val();
          currentMessage.id = childSnapshot.key;
          messagesArray.push(currentMessage);
        });
        setMessages(messagesArray);
      });
    }
  }, 1000);

  // subscribing to messages of group's collection
  useEffect(() => {
    const messagesRef = firebase
      .app()
      .database(
        'https://social-media-app-393c1-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref('groups/' + groupId + '/messages');
    messagesRef.on('value', snapshot => {
      const messagesArray = [];
      console.log(snapshot);
      snapshot.forEach(childSnapshot => {
        const currentMessage = childSnapshot.val();
        currentMessage.id = childSnapshot.key;
        messagesArray.push(currentMessage);
      });
      setMessages(messagesArray);
    });

    return () => messagesRef.off();
  }, [groupId]);

  // check for keyboard is opened or not for adjusting the height of flatlist
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardOpen(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardOpen(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // component to show messages
  const renderItem = ({item}) => {
    const isMyMessage = item.sender === user?.userId;
    const alignStyle = isMyMessage ? styles.rightAlign : styles.leftAlign;

    return (
      <View style={{flex: 1, flexDirection: isMyMessage ? 'column' : 'row'}}>
        {isMyMessage ? null : (
          <Avatar
            title={item?.userName[0]}
            rounded
            containerStyle={{backgroundColor: 'gray', marginRight: 4}}
            size={32}
          />
        )}
        <View style={[styles.messageContainer, alignStyle]}>
          <Text style={{color: isMyMessage ? 'white' : 'black'}}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  // function to add new message to group
  function addMessageToGroup(groupID, userId, text) {
    setSearch('');
    const messagesRef = firebase
      .app()
      .database(
        'https://social-media-app-393c1-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref('groups/' + groupID + '/messages');
    const timestamp = Date.now();
    messagesRef.push({
      sender: userId,
      text: text,
      timestamp: timestamp,
      userName: user?.name,
    });
  }

  // send handler
  const handleSendMessage = text => {
    if (message.trim().length > 0) {
      let userID = user?.userId;
      addMessageToGroup(groupId, userID, text);
      setMessage('');
    }
  };

  return (
    <View style={styles.root}>
      <TopBar title={groupName} onPress={() => navigation.goBack()} />
      <View style={styles.view}>
        <CustomSearchBar
          usedIn="Group"
          placeholder="Search messages..."
          onChange={async text => {
            setSearch(text);
            await handleSearch(text);
          }}
          value={search}
        />
      </View>
      <View
        style={[
          styles.listContainer,
          {
            maxHeight: isKeyboardOpen
              ? Dimensions.get('screen').height / 2.8
              : Dimensions.get('screen').height / 1.45,
          },
        ]}>
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      </View>
      <MessageInput
        placeholder="Type a message..."
        value={message}
        onChange={text => setMessage(text)}
        handleSend={() => handleSendMessage(message)}
      />
    </View>
  );
}

export default JoinedGroupDetails;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#C9D9EF',
  },
  view: {
    margin: 10,
  },
  listContainer: {
    maxHeight: Dimensions.get('screen').height / 1.45,
    paddingHorizontal: 8,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '70%',
  },
  leftAlign: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEE',
  },
  rightAlign: {
    alignSelf: 'flex-end',
    backgroundColor: '#4974b8',
  },
});
