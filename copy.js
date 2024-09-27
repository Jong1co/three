const fs = require("fs");
const path = require("path");

// 보일러 플레이트 카피하는 스크립트
function copy() {
  const sourceDirectory = path.join(__dirname, "boilerplate");
  const targetDirectory = path.join(__dirname, process.argv[2]);

  fs.cp(sourceDirectory, targetDirectory, { recursive: true }, (err) => {
    /* callback */
    console.log("error!!", err);
  });
}

copy();
