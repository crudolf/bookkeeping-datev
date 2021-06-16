<template>

  <div v-if="status == 'upload'">
    <input id="csv" type="file" @change="parseCSV">
  </div>
  <div v-if="status == 'parsing'">
    Verarbeite Datei
  </div>
  <div v-if="status == 'ready'">
    {{ bookings.length }} Buchungen

    <p>
      <select v-model="currentAccount">
        <option v-for="account in accounts" :key="account">
          {{ account }}
        </option>
      </select>

      <input type="text" v-model="textSearch">
    </p>

    <ul class="tabs">
      <li v-for="month in monthsFor(bookings)" :key="month" @click="currentMonth = month.getMonth() + 1" :class="{'active': currentMonth == month.getMonth()+1}">
        {{ formatMonth(month) }}
      </li>
    </ul>
    
    <p>
      {{ currentBookings().length }} Buchungen
    </p>

    <p v-if="currentAccount">
      Saldo: {{ calcSaldo(currentBookings()).toFixed(2) }}
    </p>

    {{ sortColumn }}

    <table>
      <tr>
        <th>
          #
        </th>
        <th @click="toggleSort('datum')">
          Datum
          <span v-if="sortColumn == 'datum'">
            <span v-if="sortOrder == 'asc'">
              &darr;
            </span>
            <span v-if="sortOrder == 'desc'">
              &uarr;
            </span>
          </span>
        </th>
        <th @click="toggleSort('betrag')">
          Betrag
          <span v-if="sortColumn == 'betrag'">
            <span v-if="sortOrder == 'asc'">
              &darr;
            </span>
            <span v-if="sortOrder == 'desc'">
              &uarr;
            </span>
          </span>
        </th>
        <th @click="toggleSort('konto')">
          Haben
          <span v-if="sortColumn == 'konto'">
            <span v-if="sortOrder == 'asc'">
              &darr;
            </span>
            <span v-if="sortOrder == 'desc'">
              &uarr;
            </span>
          </span>
        </th>
        <th @click="toggleSort('gegenKonto')">
          Soll
          <span v-if="sortColumn == 'gegenKonto'">
            <span v-if="sortOrder == 'asc'">
              &darr;
            </span>
            <span v-if="sortOrder == 'desc'">
              &uarr;
            </span>
          </span>
        </th>
        <th>
          Buchungstext
        </th>
        <th v-if="currentAccount">
          Saldo
        </th>
        <th>
          Validiert
        </th>
      </tr>
      <tr v-for="(booking, i) in currentBookings()" :key="i+'-booking'">
        <td>
          <small>
            {{ i+1 }}
          </small>
        </td>
        <td>
          {{ formatDate(booking.datum) }}
        </td>
        <td style="text-align: right">
          <b v-if="booking.betrag != 0">
            {{ booking.betrag.toFixed(2) }}
          </b>
        </td>
        <td @click="currentAccount = booking.konto">
          {{ booking.konto }}
        </td>
        <td @click="currentAccount = booking.gegenKonto">
          {{ booking.gegenKonto }}
        </td>
        <td>
          {{ booking.text }}
        </td>
        <td v-if="currentAccount">
          {{ booking.saldo.toFixed(2) }}
        </td>
        <td @click="booking.validated = true">
          <div :class="{'validated': booking.validated}">
            &nbsp;
          </div>
        </td>
      </tr>
      <tfoot>
      </tfoot>
    </table>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import {Booking} from './domain/Booking'
import moment from 'moment'

function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}

export default defineComponent({
  name: 'App',
  data: () => {
    return {
      currentCSV : null,
      bookings: [],
      months: [],
      currentMonth: null, 
      accounts: [""],
      currentAccount: null,
      textSearch: null,
      status: "upload",
      sortColumn: "datum",
      sortOrder: "asc",
    }
  },
  methods: {
    toggleSort(column:String) {
      if (this.sortColumn == column) {
        if (this.sortOrder == "asc") {
          this.sortOrder = "desc"
        } else {
          this.sortOrder = "asc"
        }
        return;
      }
      this.sortColumn = column
      this.sortOrder = "asc"
      return;
    },
    formatMonth(date) {
      return moment(date).format("MMM")
    },
    formatDate(date) {
      return moment(date).format("DD.MM.")
    },
    monthsFor(bookings) {
      var result = [];
      for (var i in bookings) {
        var booking = bookings[i]
        if (result.filter((iter) => { return booking.datum.getMonth() == iter.getMonth() }).length == 0) {
          result.push(booking.datum)
        }
      }
      return result;
    },
    calcSaldo(bookings) {
      var result = 0;

      for (var i in bookings) {
        var booking:Booking = bookings[i];
        if (booking.konto == this.currentAccount) {
          result += booking.betrag
        } else {
          result -= booking.betrag
        }
      }
      
      return result;
    },
    currentBookings() {
      var result = [];
      var saldo = 0;
      var me = this;
      for (var i in this.bookings) {
        var booking = this.bookings[i];
        if (this.currentMonth) {
          if (booking.datum.getMonth() != this.currentMonth - 1) {
            continue;
          }
        }
        if (this.currentAccount) {
          if (booking.konto != this.currentAccount && booking.gegenKonto != this.currentAccount) {
            continue;
          }
        }

        if (this.textSearch) {
          if (booking.text && booking.text.toUpperCase().indexOf(this.textSearch.toUpperCase()) == -1) {
            continue;
          }
        }

        
        if (booking.konto == this.currentAccount) {
          saldo += booking.betrag
        } else {
          saldo -= booking.betrag
        }

        booking.saldo = saldo

        result.push(booking)
      }

      result = result.sort((a:Booking,b:Booking) => {

        var sortOrderMultiplilkator = me.sortOrder == "asc" ? 1 : -1;

        if (me.sortColumn == 'datum') {
          return (a.datum.getTime() - b.datum.getTime()) * sortOrderMultiplilkator;
        }
        
        if (me.sortColumn == 'betrag') {
          return (a.betrag - b.betrag) * sortOrderMultiplilkator;
        }
        
        if (me.sortColumn == 'konto') {
          return a.konto.localeCompare(b.konto) * sortOrderMultiplilkator;
        }
        
        if (me.sortColumn == 'gegenKonto') {
          return a.gegenKonto.localeCompare(b.gegenKonto) * sortOrderMultiplilkator;
        }
        
        return (a.datum.getTime() - b.datum.getTime()) * sortOrderMultiplilkator;
      })

      return result;
    },
    parseCSV(data) {
      var me = this;
      me.status = "parsing"
      var reader = new FileReader();
      var newAccounts = []
      reader.onload = function () {

        me.currentCSV = CSVToArray(reader.result, ";")
        var bookings = []
        for (var i in me.currentCSV) {
          if (i > 2) {
            var line = me.currentCSV[i]

            var date

            if (line[9].length == 3) {
              date = new Date(2019, parseInt(line[9].substring(1), 10)-1, parseInt(line[9].substring(0, 1), 10)) 
            } else {
              date = new Date(2019, parseInt(line[9].substring(2), 10)-1, parseInt(line[9].substring(0, 2), 10)) 
            }

            var booking = {
              betrag: line[1] == "H" ? parseFloat(line[0].replace(",", ".")) : -parseFloat(line[0].replace(",", ".")),
              konto: line[6],
              gegenKonto: line[7],
              bu: line[8],
              datum: date,
              text: line[13]
            } as Booking;

            if (newAccounts.indexOf(booking.konto) == -1) {
              newAccounts.push(booking.konto)
            }

            if (newAccounts.indexOf(booking.gegenKonto) == -1) {
              newAccounts.push(booking.gegenKonto)
            }

            bookings.push(booking)
          }          
        }
        me.bookings = bookings
        me.accounts = newAccounts;
        me.accounts.sort()
        me.status = "ready"
      };
      reader.readAsBinaryString(data.target.files[0])
    }
  },
  components: {}
})

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.validated {
  background-color: green !important;
  text-align: center;
}
tr:nth-child(2n+1) {
  background: #CCC;
}
td {
  padding: 2px 4px;
}
.tabs {
  display: flex;
  padding: 0px;
}
.tabs li {
  padding: 1em;
  list-style: none;
  cursor: pointer;
}
.tabs li.active {
  background: #ccc;
}
</style>