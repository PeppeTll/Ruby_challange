
const fs = require('fs');

//Salvo il file json all'interno della costante data
const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

// creao una lista delle festività italiane in formato YYYY-MM-DD
const holidays = [
  "2017-01-01", // Capodanno
  "2017-01-06", // Epifania
  "2017-04-16", // Pasqua
  "2017-04-25", // Festa della Liberazione
  "2017-05-01", // Festa dei Lavoratori
  "2017-06-02", // Festa della Repubblica
  "2017-06-13", // Santo Patrono di Padova
  "2017-08-15", // Assunzione di Maria
  "2017-11-01", // Ognissanti
  "2017-12-08", // Immacolata Concezione
  "2017-12-25", // Natale
  "2017-12-26", // Santo Stefano
];

//creo la funzione che calcola quanti giorni ci sono nell'intervallo di periodo
const countDays = (start, end, devBirthday) => {
  //restituisce la data completa del giorno indicato
  const startDate = new Date(start);
  const endDate = new Date(end);

  //sostiuisco l'anno di nascita del dev con l'anno corrente
  const birthday = devBirthday.split('-');
  birthday[0] = "2017";
  const newYearBirthday = birthday.join('-');

  //calcolo il giorno della settiman del compleanno del dev
  const birthdayDate = new Date(newYearBirthday);
  const dayOfTheWeekBirthday = birthdayDate.getDay();

  let workDays = 0
  let holidaysCount = 0
  let totalDay = 0
  let weekEndDays = 0

  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    // restituisce il giorno della settimana da un rage 0 / 7, 0 domenica, 1 lunedì, ecc...
    dayOfWeek = startDate.getDay();
    // restituisce la nuova data creata a riga 24 in formato YYYY-MM-DD
    const dateString = startDate.toISOString().split('T')[0];
    //condizioni per assegnare alle variabili il tipo di giorno
    if (holidays.includes(dateString)) {
      holidaysCount++;
      getDayOfTheWeekHoliday = startDate.getDay();
      //se i giorni festivi sono domenica o sabato vengono assegnati al weekend
      if (getDayOfTheWeekHoliday === 0 || getDayOfTheWeekHoliday === 6) {
        weekEndDays++;
      }
    } else if (dayOfWeek !== 0 /*domenica*/ && dayOfWeek !== 6 /*sabato*/ && !holidays.includes(dateString) && dateString !== newYearBirthday) {
      workDays++;
    } else if (dayOfWeek === 0 || dayOfWeek === 6 || dayOfTheWeekBirthday === 0 || dayOfTheWeekBirthday === 6) {
      weekEndDays++;
    }
    //+1 al count dei giorni totali
    totalDay++;
    // prende la data creata in formato YYYY-MM-DD e aumenta di 1 il giorno per far andare avanti il ciclo while
  }

  //ritorno un oggetto che contiene le 4 variabili che mi interessano
  return {
    workDays,
    holidaysCount,
    totalDay,
    weekEndDays
  }
}

const availabilities = data.developers.map(dev => {
  const devID = dev.id;
  const devBirthday = dev.birthday

  const dataOBJ = data.periods.map(period => ({
    developer_id: devID,
    period_id: period.id,
    total_days: countDays(period.since, period.until, devBirthday).totalDay,
    workdays: countDays(period.since, period.until, devBirthday).workDays,
    weekend_days: countDays(period.since, period.until, devBirthday).weekEndDays,
    holidays: countDays(period.since, period.until, devBirthday).holidaysCount,
  }))

  return dataOBJ
})

console.log(availabilities);