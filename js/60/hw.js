'use strict';

function trackDosage(medicationName, initialDosage) {
  let medication = medicationName;
  let dosage = initialDosage || 0;

  function getInstructions() {
    return console.log(`take ${medication}ml`);
  }

  function adjustDosage(doctorPin, newDosage) {
    const pin = 1234;
    if (doctorPin === pin && newDosage > 0) {
      dosage = newDosage;
    }
  }

  
  return { getInstructions, adjustDosage, getDosage: () => dosage };
}

const meds = trackDosage('acetaminophen', 5);
meds.getInstructions();
meds.adjustDosage(1234, 10);
console.log(meds.getDosage()); 