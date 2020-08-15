class HealthHelper {
  static calculateIMC(height, weight) {
    return ((weight) / (height * height));
  }

  static calculateIAC(hip, height) {
    const squareHeight = Math.sqrt(height);
    return (hip / (height * squareHeight)) - 18;
  }
}

module.exports = HealthHelper;
