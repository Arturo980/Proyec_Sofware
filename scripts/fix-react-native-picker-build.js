const fs = require('fs');
const path = require('path');

const gradleFilePath = path.join(__dirname, '../node_modules/react-native-picker/android/build.gradle');
const pickerViewModulePath = path.join(__dirname, '../node_modules/react-native-picker/android/src/main/java/com/beefe/picker/PickerViewModule.java');

fs.readFile(gradleFilePath, 'utf8', (err, data) => {
  if (err) {
    return console.log(err);
  }
  let result = data.replace(/compile /g, 'implementation ');
  result = result.replace(/compileSdkVersion \d+/g, 'compileSdkVersion 34');
  result = result.replace(/buildToolsVersion ".*"/g, 'buildToolsVersion "34.0.0"');
  result = result.replace(/targetSdkVersion \d+/g, 'targetSdkVersion 34');

  fs.writeFile(gradleFilePath, result, 'utf8', (err) => {
    if (err) return console.log(err);
  });
});

fs.readFile(pickerViewModulePath, 'utf8', (err, data) => {
  if (err) {
    return console.log(err);
  }
  let result = data.replace(/android.support.annotation.Nullable/g, 'androidx.annotation.Nullable');

  fs.writeFile(pickerViewModulePath, result, 'utf8', (err) => {
    if (err) return console.log(err);
  });
});