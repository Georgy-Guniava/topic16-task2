import './style.scss';
import $ from 'jquery';
import { createStore } from 'redux';

const startState = [];

const refreshBtn = $('.refresh-btn');
const closeButton1 = $('.trash-1');
const closeButton2 = $('.trash-2');
const closeButton3 = $('.trash-3');

const controls = [$('.control-1'), $('.control-2'), $('.control-3')];
const items = [$('.item-1'), $('.item-2'), $('.item-3')];

const randomOffset = Math.floor(Math.random()*500);
const githubURL = 'https://api.github.com/users?since=';


const updateDomList = () => {
  const state = store.getState();
  state.forEach((itemState, index) => {
    let item = items[index];
    item.find('.photo img').attr('src', itemState.avatar_url);
    item.find('.name span').text(itemState.name || 'no name');
    item.find('.city span').text(itemState.location || 'no location');
    item.find('.nick span').text('@' + itemState.login);
  })
};

const loadItemData = async (user) => {
  let userData = await $.ajax(user.url);

  return {
    name: userData.name,
    avatar_url: userData.avatar_url,
    location: userData.location,
    login: userData.login
  }
};

const loadItem = async () => {
  let users = await $.ajax(githubURL + randomOffset);
  return await loadItemData(users[Math.floor(Math.random() * users.length)])
};

const loadThreeItems = async () => {
  let users = await $.ajax(githubURL + randomOffset);

  return Promise.all([
    loadItemData(users[Math.floor(Math.random() * users.length)]),
    loadItemData(users[Math.floor(Math.random() * users.length)]),
    loadItemData(users[Math.floor(Math.random() * users.length)])
  ])

};


// constants
const UPDATE_ALL_ITEMS = 'UPDATE_ALL_ITEMS';
const UPDATE_ONE_ITEM = 'UPDATE_ONE_ITEM';


// actions

const updateAllItems = (data) => {
  return {
    type: UPDATE_ALL_ITEMS,
    data: data
  }
};

const updateOneItem = (number, data) => {
  return {
    type: UPDATE_ONE_ITEM,
    number: number,
    data: data
  }
};


// reducer

const updateList = (state = startState, action) => {
  switch (action.type) {
    case UPDATE_ALL_ITEMS:
     return action.data;

    case UPDATE_ONE_ITEM:
      let newState = [];
      state.forEach((item, index) => {
        if (index === action.number) {
          newState.push(action.data)
        } else {
          newState.push(item)
        }
      });
      return newState;

    default:
      return state;
  }
};

const store = createStore(updateList);
store.subscribe(updateDomList);

refreshBtn.click( () => {
  loadThreeItems()
    .then((data) => {
      store.dispatch(updateAllItems(data));
    })
    .catch((err) => console.log('ERROR',err))
});

closeButton1.click(async () => {
  let data = await loadItem();
  store.dispatch(updateOneItem(0, data));
});

closeButton2.click(async () => {
  let data = await loadItem();
  store.dispatch(updateOneItem(1, data));
});

closeButton3.click(async () => {
  let data = await loadItem();
  store.dispatch(updateOneItem(2, data));
});

const startLoad = () => {
  loadThreeItems()
    .then((data) => {
      store.dispatch(updateAllItems(data));
    })
};

startLoad();

controls.forEach((control, index) => {
  const item = items[index];
  control.mouseenter(() => {
    const coordinate = item.offset();
    item.offset({left: coordinate.left - 113})
  });
  control.mouseleave(() => {
    const coordinate = item.offset();
    item.offset({left: coordinate.left + 113})
  });
});



