const vehicleProto = {
  go(speed) {
    this.speed = speed;
    console.log("Now going at " + speed + " mph.");
  },
  print() {
    console.log("The " + this.color + " vehicle is driving at " + this.speed + " mph.");
  }
};

function createVehicle(color) {
  const v = Object.create(vehicleProto);
  v.color = color;
  v.speed = 0;
  return v;
}

function createPlane(color) {
  const p = Object.create(vehicleProto);
  p.color = color;
  p.go = function(speed) {
    this.speed = speed;
    console.log("Now flying at " + speed + " mph.");
  };
  p.print = function() {
    console.log("The " + this.color + " plane is flying at " + this.speed + " mph.");
  };
  return p;
}
const ford = createVehicle("red");
ford.go(50);
ford.print();
const cessna = createPlane("white");
cessna.go(200);
cessna.print();