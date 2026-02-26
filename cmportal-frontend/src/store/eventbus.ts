import store from './index';
import {Module, VuexModule, Mutation, Action} from 'vuex-module-decorators';
import {TEvent} from "@/types/TEvent";

@Module({ namespaced: true, dynamic: true, store, name: 'storeEventsBus'})
export default class EventsBus extends VuexModule {
    public event: TEvent & {eventId:number} = {
        eventId :0,
        name: '',
        params: null
    };

    @Mutation
    public SET_EVENT(pevent: TEvent) {
        this.event.name = pevent.name;
        this.event.params = pevent.params;
        this.event.eventId++;
    }
    @Action
    public set_event(pevent: TEvent) {
        this.context.commit('SET_EVENT', pevent);
    }
}
