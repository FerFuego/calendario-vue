<template>
    <div class="container">
        <v-row class="fill-height">
            <v-col>
            <v-sheet height="64">
                <v-toolbar
                flat
                >
                <v-btn color="primary" dark class="mr-4" @click="dialog = true">
                  Agregar Evento
                </v-btn>
                <v-btn
                    outlined
                    class="mr-4"
                    color="grey darken-2"
                    @click="setToday"
                >
                    Hoy
                </v-btn>
                <v-btn
                    fab
                    text
                    small
                    color="grey darken-2"
                    @click="prev"
                >
                    <v-icon small>
                    mdi-chevron-left
                    </v-icon>
                </v-btn>
                <v-btn
                    fab
                    text
                    small
                    color="grey darken-2"
                    @click="next"
                >
                    <v-icon small>
                    mdi-chevron-right
                    </v-icon>
                </v-btn>
                <v-toolbar-title v-if="$refs.calendar">
                    {{ $refs.calendar.title }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-menu
                    bottom
                    right
                >
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        outlined
                        color="grey darken-2"
                        v-bind="attrs"
                        v-on="on"
                    >
                        <span>{{ typeToLabel[type] }}</span>
                        <v-icon right>
                        mdi-menu-down
                        </v-icon>
                    </v-btn>
                    </template>
                    <v-list>
                    <v-list-item @click="type = 'day'">
                        <v-list-item-title>Dia</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = 'week'">
                        <v-list-item-title>Semana</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = 'month'">
                        <v-list-item-title>Mes</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = '4day'">
                        <v-list-item-title>4 dias</v-list-item-title>
                    </v-list-item>
                    </v-list>
                </v-menu>
                </v-toolbar>
            </v-sheet>
            <v-sheet height="600">
                <v-calendar
                  ref="calendar"
                  v-model="focus"
                  color="primary"
                  :events="events"
                  :event-color="getEventColor"
                  :type="type"
                  @click:event="showEvent"
                  @click:more="viewDay"
                  @click:date="viewDay"
                  @change="updateRange"
                  locale="es"
                  :short-weekdays="false"
                ></v-calendar>

                <!-- Modal Add Event -->
                <v-dialog v-model="dialog" max-width="500px">
                  <v-card>
                    <v-container>
                      <v-form @submit.prevent="addEvent">
                        <v-card-title>
                          <span class="headline">Agregar Evento</span>
                        </v-card-title>
                        <v-card-text>
                          <v-text-field type="text" v-model="name" label="Nombre"></v-text-field>
                          <v-text-field type="text" v-model="details" label="Detalle"></v-text-field>
                          <v-text-field type="color" v-model="color" label="Color"></v-text-field>
                          <v-text-field type="date" v-model="start" label="Comienzo del Evento"></v-text-field>
                          <v-text-field type="date" v-model="end" label="Final del Evento"></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" text @click="dialog = false">Cancelar</v-btn>
                          <v-btn type="submit" color="blue darken-1" text @click.stop="dialog = false">Agregar</v-btn>
                        </v-card-actions>
                      </v-form>
                    </v-container>
                  </v-card>
                </v-dialog>
                <!-- End Modal Add Event -->

                <v-menu
                v-model="selectedOpen"
                :close-on-content-click="false"
                :activator="selectedElement"
                offset-x
                >
                  <v-card
                      color="grey lighten-4"
                      min-width="350px"
                      flat
                  >
                      <v-toolbar
                        :color="selectedEvent.color"
                        dark
                      >
                      <v-btn icon @click="deleteEvent(selectedEvent)">
                          <v-icon>mdi-delete</v-icon>
                      </v-btn>
                      <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                      <v-spacer></v-spacer>
                      </v-toolbar>

                      <v-card-text>
                          <v-form v-if="currentlyEditing !== selectedEvent.id">
                            {{ selectedEvent.details }} 
                          </v-form>

                          <v-form v-else>
                            <v-text-field type="text" v-model="selectedEvent.name" label="Editar Nombre"></v-text-field>
                            <textarea-autosize 
                              v-model="selectedEvent.details"
                              type="text"
                              style="width:100%"
                              :min-height="100"
                              label="Editar Detalle"
                            ></textarea-autosize>
                          </v-form>
                      </v-card-text>

                      <v-card-actions>
                        <v-btn
                            text
                            color="secondary"
                            @click="selectedOpen = false"
                        >
                            Cancelar
                        </v-btn>
                        <v-btn
                            text
                            color="secondary"
                            @click.prevent="editEvent(selectedEvent)"
                            v-if="currentlyEditing !== selectedEvent.id"
                        >
                            Editar
                        </v-btn>
                        <v-btn
                            text
                            color="secondary"
                            v-else
                            @click.prevent="updateEvent(selectedEvent)"
                        >
                            Guardar
                        </v-btn>
                      </v-card-actions>
                  </v-card>
                </v-menu>
            </v-sheet>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import {db} from '../main'

  export default {
    data: () => ({
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Mes',
        week: 'Semana',
        day: 'Dia',
        '4day': '4 Dias',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      name: '',
      details: '',
      color: '#1976D2',
      start: '',
      end: '',
      dialog: '',
      currentlyEditing: null
    }),
    mounted () {
      this.$refs.calendar.checkChange()
    },
    created() {
      this.getEvents()
    },
    methods: {
      async addEvent() {
        try {
          if (this.name && this.start && this.end) {
            await db.collection('events').add({
                name: this.name,
                details: this.details,
                color: this.color,
                start: this.start,
                end: this.end,
            })
            this.getEvents();
            this.name = '';
            this.details = '';
            this.color = '#1976D2';
            this.start = '';
            this.end = '';
          }
        } catch (e) {
          console.log(e)
        }
      },
      async getEvents() {
          try {
              const events = [];
              const snapshot = await db.collection('events').get();

              snapshot.forEach(doc => {
                  //console.log(doc.id);
                  let eventData = doc.data();
                  eventData.id = doc.id;
                  events.push(eventData);
              });

              this.events = events;

          } catch (e) {
            console.log(e)
          }
      },
      async deleteEvent(ev) {
        try {
          await db.collection('events').doc(ev.id).delete();
          this.selectedOpen = false; // close modal
          this.getEvents();
        } catch (e) {
          console.log(e)
        }
      },
      editEvent(ev) {
          this.currentlyEditing = ev.id;
      },
      async updateEvent(ev) {
        try {
          await db.collection('events').doc(ev.id).update({
            name: ev.name,
            details: ev.details
          })
          this.getEvents();
          this.currentlyEditing = null;
          this.selectedOpen = false;
        } catch (e) {
          console.log(e)
        }
      },
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = new Date().toISOString().slice(0, 10)
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange ({ start, end }) {
        // Do something
      },
    },
  }
</script>
