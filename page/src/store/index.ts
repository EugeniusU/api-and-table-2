import { createStore } from 'vuex'
import axios from 'axios'

const url = 'http://localhost:3000/leads/find';
const url2 = 'http://localhost:3000/contacts/find';

const url3 = 'http://localhost:3000/all';
const urlQuery = 'http://localhost:3000/search/'

interface ContactMain {
  name: string
  phone?: string
  email?: string
  externalId: number
  responsibleuserid: number
  leads: number[] | [] | string
}
/*
interface ContactPre {
  name: string
  phone?: string
  email?: string
  externalId: number
  responsibleuserid: number
  leads: string
}*/

interface Contact extends ContactMain {
  leads: number[]
}

interface ContactPre extends ContactMain {
  leads: string
}

interface Simple {
  name: string
  phone: string
  email: string
}

interface Lead {
  name: string
  externalId: number
  contact?: Simple
}

export default createStore({
  state: {
    data: [],
    leads: [],
    contacts: []
},
mutations: {
  SET_DATA_TO_STATE: (state, data) => {
    state.data = data;
  },
  SET_LEADS_TO_STATE: (state, data) => {
    state.leads = data;
  },
  SET_CONTACTS_TO_STATE: (state, data) => {
      const contacts = data.map((contact: ContactPre) => {
        contact.leads = JSON.parse(contact.leads);
        return contact;
      })
      state.contacts = contacts;
  },
  APPLY_TO_LEADS: (state, data) => {
    const filtred = data.filter((contact: Contact) => contact.leads.length)
    
    const pre = state.leads.map(x => x);
    const test: Lead[] = [];
  
    filtred.forEach((contact: Contact) => {
      contact.leads.forEach((id: number) => {
        pre.forEach((lead: Lead) => {
          lead['contact'] = { name: '', phone: '', email: '' };
          lead['contact']['name'] = 'Неизвестно';
          lead['contact']['phone'] = 'Неизвестно';
          lead['contact']['email'] = 'Неизвестно';

          if (id === lead.externalId) {
            lead['contact']['name'] = contact.name;

            if (contact.phone) {
              lead['contact']['email'] = contact.phone;
            }

            if (contact.email) {
              lead['contact']['email'] = contact.email;
            }

            test.push(lead);
          }
        })
      })
    })

    state.leads = pre;
  },
  SET_CONTACTS_WITH_LEADS_TO_STATE: (state, data) => {
    state.leads = data;
  }
},
actions: {
    GET_DATA_FROM_API({commit}) {
      return axios(url, {
            method: 'GET'
        })
        .then((data) => {
            commit('SET_DATA_TO_STATE', data.data);
            return data.data;
        })
        .catch((error) => {
            console.log(error);
            return error;
        })
    },

  GET_LEADS_FROM_API({ commit }) {
    return axios(url, {
      method: 'GET'
    })
      .then((data) => {
        commit('SET_LEADS_TO_STATE', data.data);
        return data.data;
      })
      .catch((error: any) => {
        console.log(error);
        return error;
      })
  },
  GET_CONTACTS_FROM_API({ commit }) {
    return axios(url2, {
      method: 'GET'
    })
      .then((data) => {
        commit('SET_CONTACTS_TO_STATE', data.data);
        return data.data;
      })
      .catch((error: any) => {
        console.log(error);
        return error;
      })
  },
  GET_CONTACTS_WITH_LEADS_FROM_API({ commit }) {
    return axios(url3, {
      method: 'GET'
    })
      .then((data) => {
        commit('SET_CONTACTS_WITH_LEADS_TO_STATE', data.data);
        return data.data;
      })
      .catch((error: any) => {
        console.log(error);
        return error;
      })
  },

  GET_FILTRED_WITH_QUERY({ commit }, query) {
    return axios(`${urlQuery}${query}`, {
      method: 'GET'
    })
      .then((data) => {
        commit('SET_LEADS_TO_STATE', data.data);
        return data.data;
      })
      .catch((error) => {
        console.log(error);
        return error;
      })
  }
},
getters: {
    DATA(state) {
        return state.data;
    },
}
})
