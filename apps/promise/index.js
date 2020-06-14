(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    (function() {
        const env = {};
        try {
            if (process) {
                process.env = Object.assign({}, process.env);
                Object.assign(process.env, env);
                return;
            }
        } catch (e) {} // avoid ReferenceError: process is not defined
        globalThis.process = { env:env };
    })();

    const STORAGE_KEY = 'promise-app';

    const defaultState = {
      boards: {},
      newBoardUid: 0,

      cardLists: {},
      newCardListUid: 0,

      cardItems: {},
      newCardItemUid: 0,

      cardListUidToBoardUid: {},
      cardItemUidToCardListUid: {},
    };

    defaultState.boards[0] = {
      uid: 0,
      title: 'Getting Started',
      uids: [],
    };

    let state;

    if (window.localStorage.getItem(STORAGE_KEY) === null) {
      state = defaultState;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      state = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    }

    var state$1 = state;

    const mutations = {
      ADD_BOARD(state, { title }) {
        state.boards[state.newBoardUid] = {
          uid: state.newBoardUid,
          title,
          uids: [],
        };
        ++state.newBoardUid;
      },

      DELETE_BOARD(state, { uid }) {
        delete state.boards[uid];
      },

      ADD_CARD_LIST(state, { uid, title }) {
        state.cardListUidToBoardUid[state.newCardListUid] = uid;
        state.boards[uid].uids.push(state.newCardListUid);
        state.cardLists[state.newCardListUid] = {
          parentUid: uid,
          uid: state.newCardListUid,
          title,
          uids: [],
        };
        ++state.newCardListUid;
      },

      UPDATE_CARD_LIST(state, { uid, title }) {
        state.cardLists[uid].title = title;
      },

      DELETE_CARD_LIST(state, { uid }) {
        const boardUid = state.cardListUidToBoardUid[uid];
        state.boards[boardUid].uids.splice(
          state.boards[boardUid].uids.indexOf(uid),
          1,
        );
        delete state.cardLists[uid];
        delete state.cardListUidToBoardUid[uid];
      },

      ADD_CARD_ITEM(state, { uid, title }) {
        state.cardItemUidToCardListUid[state.newCardItemUid] = uid;
        state.cardLists[uid].uids.push(state.newCardItemUid);
        state.cardItems[state.newCardItemUid] = {
          parentUid: uid,
          uid: state.newCardItemUid,
          title,
        };
        ++state.newCardItemUid;
      },

      UPDATE_CARD_ITEM(state, { uid, title }) {
        state.cardItems[uid].title = title;
      },

      DELETE_CARD_ITEM(state, { uid }) {
        const cardListUid = state.cardItemUidToCardListUid[uid];
        state.cardLists[cardListUid].uids.splice(
          state.cardLists[cardListUid].uids.indexOf(uid),
          1,
        );
        delete state.cardItems[uid];
        delete state.cardItemUidToCardListUid[uid];
      },
    };

    const actions = {
      addBoard({ commit }, { title }) {
        commit('ADD_BOARD', { title });
      },

      async deleteBoard({ dispatch, commit, state }, { uid }) {
        Promise.all(
          [...state.boards[uid].uids]
            .reverse()
            .map(uid => dispatch('deleteCardList', { uid })),
        ).then(() => {
          commit('DELETE_BOARD', { uid });
        });
      },

      addCardList({ commit }, { uid, title }) {
        commit('ADD_CARD_LIST', { uid, title });
      },

      updateCardList({ commit }, { uid, title }) {
        commit('UPDATE_CARD_LIST', { uid, title });
      },

      deleteCardList({ dispatch, commit, state }, { uid }) {
        Promise.all(
          [...state.cardLists[uid].uids]
            .reverse()
            .map(uid => dispatch('deleteCardItem', { uid })),
        ).then(() => {
          commit('DELETE_CARD_LIST', { uid });
        });
      },

      addCardItem({ commit }, { uid, title }) {
        commit('ADD_CARD_ITEM', { uid, title });
      },

      updateCardItem({ commit }, { uid, title }) {
        commit('UPDATE_CARD_ITEM', { uid, title });
      },

      deleteCardItem({ commit }, { uid }) {
        commit('DELETE_CARD_ITEM', { uid });
      },
    };

    let timeout;
    const localStoragePlugin = store => {
      store.subscribe((mutation, state) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        });
      });
    };

    const plugins = [localStoragePlugin];

    const store = Vuex.createStore({
      state: state$1,
      mutations,
      actions,
      plugins,
    });

    var EditableDiv = {
      inheritAttrs: true,
      props: {
        value: {
          type: String,
          default: '',
        },
        done: {
          required: true,
          type: Function,
        },
        placeholder: {
          type: String,
          default: '',
        },
      },
      setup(props) {
        const state = Vue.reactive({
          isEditing: false,
          newValue: props.value,
          placeholder: Vue.computed(() => props.placeholder),
        });
        const inputRef = Vue.ref(null);

        function done() {
          props.done(state.newValue, async () => {
            await Vue.nextTick();
            cancel();
          });
        }

        async function edit() {
          state.newValue = props.value;
          state.isEditing = true;
          await Vue.nextTick();
          inputRef.value.focus();
        }

        function cancel() {
          state.newValue = props.value;
          state.isEditing = false;
        }

        return {
          state,
          inputRef,
          cancel,
          edit,
          done,
        }
      },
      template: `
<div
  v-if="state.isEditing === false"
  @dblclick="edit"
  class="select-none"
>{{ state.newValue || state.placeholder }}</div>
<input
  v-else
  ref="inputRef"
  @keyup.enter="done"
  @blur="cancel"
  @keyup.esc="cancel"
  v-model="state.newValue"
  :placeholder="state.placeholder"
  class="bg-gray-400 outline-none"
/>
`,
    };

    var AnotherCard = {
      props: {
        uid: {
          required: true,
          type: String,
        },
      },
      setup(props) {
        const store = Vuex.useStore();
        const state = Vue.reactive({
          placeholder: Vue.computed(() =>
            store.state.cardLists[props.uid].uids.length === 0
              ? 'Add a card'
              : 'Add another card',
          ),
        });

        function addCardItem(newValue, done) {
          if (newValue.trim() === '') return done()

          store.dispatch('addCardItem', {
            uid: props.uid,
            title: newValue,
          });

          done();
        }

        return {
          state,
          addCardItem,
        }
      },
      components: {
        EditableDiv,
      },
      template: `
<div
  class="card-item w-64 inline-flex flex-col rounded"
>
  <editable-div
    :placeholder="state.placeholder"
    :done="addCardItem"
    class="rounded px-2 py-1"
  ></editable-div>
</div>
`,
    };

    var RemoveButton = {
      template: `
<button
  class="flex justify-center items-center w-8 h-8 pb-1 rounded bg-gray-300 hover:bg-red-600"
  v-bind="$attrs"
  v-on="$listeners"
>
  <slot></slot>
</button>
`,
    };

    var CardHeader = {
      name: 'card-header',
      props: {
        uid: {
          required: true,
          type: String,
        },
      },
      setup(props) {
        const store = Vuex.useStore();
        const state = Vue.reactive({
          cardList: Vue.computed(() => store.state.cardLists[props.uid]),
          newTitle: store.state.cardLists[props.uid].title,
          isEditing: false,
        });

        function done(newValue, done) {
          if (newValue.trim() === '') {
            newValue = store.state.cardLists[props.uid].title;
          }

          store.commit('UPDATE_CARD_LIST', {
            uid: props.uid,
            title: newValue,
          });

          done();
        }

        function deleteCardList() {
          if (confirm('Are you sure?')) {
            store.dispatch('deleteCardList', {
              uid: props.uid,
            });
          }
        }

        return {
          state,
          done,
          deleteCardList,
        }
      },
      components: {
        RemoveButton,
        EditableDiv,
      },
      template: `
<div
  class="card-header select-none inline-flex justify-between"
>
  <editable-div
    :value="state.cardList.title"
    :done="done"
    class="w-48 rounded px-2 py-1"
  ></editable-div>

  <remove-button
    @click="deleteCardList"
  >x</remove-button>
</div>
  `,
    };

    var CardItem = {
      name: 'card-item',
      props: {
        uid: {
          required: true,
          type: String,
        },
      },
      setup(props) {
        const store = Vuex.useStore();
        const state = Vue.reactive({
          cardItem: Vue.computed(() => store.state.cardItems[props.uid]),
        });

        function deleteCardItem() {
          if (confirm('Are you sure?')) {
            store.dispatch('deleteCardItem', {
              uid: props.uid,
            });
          }
        }

        function updateTitle(newValue, done) {
          if (newValue.trim() === '') return done()

          store.dispatch('updateCardItem', {
            uid: props.uid,
            title: newValue,
          });

          done();
        }

        return {
          state,
          deleteCardItem,
          updateTitle,
        }
      },
      components: {
        EditableDiv,
        RemoveButton,
      },
      template: `
<div
  class="card-item w-64 flex flex-row justify-between"
>
  <editable-div
    :value="state.cardItem.title"
    :done="updateTitle"
    class="inline-block text-gray-700 rounded w-48 bg-white px-2 py-1"
  ></editable-div>

  <remove-button
    @click="deleteCardItem"
  >x</remove-button>
</div>
  `,
    };

    var CardList = {
      name: 'card-list',
      props: {
        uid: {
          required: true,
          type: String,
        },
      },
      setup(props) {
        const store = Vuex.useStore();
        const state = Vue.reactive({
          cardList: Vue.computed(() => store.state.cardLists[props.uid]),
        });

        return {
          state,
        }
      },
      components: {
        CardHeader,
        CardItem,
        EditableDiv,
        AnotherCard,
      },
      template: `
<div
  class="card-list inline-flex flex-col rounded bg-gray-200 bg-opacity-50 p-2 max-h-screen-92"
>
  <card-header
    :uid="state.cardList.uid"
    :key="state.cardList.uid"
  ></card-header>

  <hr class="mt-2 border-gray-400">

  <div
    class="card-list-body mt-2 overflow-y-auto"
  >
    <template v-for="(uid, index) of state.cardList.uids">
      <card-item
        :uid="uid"
        :key="uid"
        :class="{ 'mt-2': index !== 0 }"
      ></card-item>
    </template>
  </div>

  <another-card
    :uid="state.cardList.uid"
    :class="{ 'mt-2': state.cardList.uids.length !== 0 }"
  ></another-card>
</div>
`,
    };

    var AnotherList = {
      props: {
        uid: {
          required: true,
          type: String,
        },
      },
      setup(props) {
        const store = Vuex.useStore();
        const state = Vue.reactive({
          placeholder: Vue.computed(() =>
            store.state.boards[props.uid].uids.length === 0
              ? 'Add a list'
              : 'Add another list',
          ),
        });

        function addCardList(newValue, done) {
          if (newValue.trim() === '') return done()

          store.dispatch('addCardList', {
            uid: props.uid,
            title: newValue,
          });

          done();
        }

        return {
          state,
          addCardList,
        }
      },
      components: {
        EditableDiv,
      },
      template: `
<div
  class="card-list fit-h-content inline-flex flex-col w-64 rounded bg-gray-200 bg-opacity-50 p-2"
>
  <editable-div
    :placeholder="state.placeholder"
    :done="addCardList"
    class="rounded px-2 py-1 w-56"
  ></editable-div>
</div>
`,
    };

    var Board = {
      name: 'board',
      props: {
        uid: {
          required: true,
          type: Number,
        },
      },
      setup(props) {
        const store = Vuex.useStore();
        const state = Vue.reactive({
          board: Vue.computed(() => store.state.boards[props.uid]),
        });

        return {
          state,
        }
      },
      components: {
        CardList,
        AnotherList,
      },
      template: `
<div
  class="board rounded max-w-screen-96 max-h-screen-96 inline-flex justify-start items-start overflow-y-hidden overflow-x-auto m-2"
>
  <card-list
    v-for="(uid, index) of state.board.uids"
    :key="uid"
    :uid="uid"
    :class="{ 'ml-2': index !== 0 }"
  ></card-list>

  <another-list
    :uid="state.board.uid"
    class="ml-2"
  ></another-list>
</div>
`,
    };

    var App = {
      name: 'app',
      components: {
        Board,
      },
      template: `
<div
  class="app w-screen h-screen overflow-hidden"
>
  <board
    :uid="0"
  ></board>
</div>
`,
    };

    const app = Vue.createApp({
      components: {
        App,
      },
      template: `<app></app>`,
    });

    app.use(store);
    app.mount('#app');

})));
