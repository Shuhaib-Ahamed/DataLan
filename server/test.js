import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const form = new FormData();

form.append(
  "file",
  fs.createReadStream("https://github.com/Shuhaib-Ahamed/AutoCS-Desentralized-Datamarketplace-Using-AutoML-/blob/master/test.csv"),
  {
    filename: "test.csv",
  }
);
form.append(
  "toPublicKey",
  "GBY37ICWBITVTZHPEPKIRUDNDSOC7IFSYETU3ZLXPUNNF5PEHZJXYA7C"
);
form.append(
  "fromSecretKey",
  "SAQB3VFGHX3HJFKBFZ24YKH6TYV3SFKZYQXYSO3SBF4MMAF4A7T2NMVH"
);
form.append("assetTitle", "Asset#442");
form.append("assetDescription", "Asset 50");
form.append("assetPrice", "200");

async function measureTPS() {
  const startTime = Date.now();

  // Make multiple requests to the API in parallel
  const requests = Array(1)
    .fill()
    .map(() =>
      axios.post("http://localhost:9000/api/v1/chain/upload", form, {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZDRlNGRkNmIyZmQ2ZmYzYzgyY2JlMiIsInB1YmxpY0tleSI6IkdCWTM3SUNXQklUVlRaSFBFUEtJUlVETkRTT0M3SUZTWUVUVTNaTFhQVU5ORjVQRUhaSlhZQTdDIiwicm9sZSI6IkJVWUVSIiwiaWF0IjoxNjc1Nzc2MTg0LCJleHAiOjE2NzYwMzUzODR9.p0uINq5uLAj4OwIkxrXUteUIEl3cecQSeCO4_zF8REA",
        "Content-Type": "multipart/form-data",
      })
    );

  await Promise.all(requests);

  const endTime = Date.now();
  const elapsedTime = endTime - startTime;

  // Calculate TPS by dividing the number of requests by the time elapsed
  const tps = requests.length / (elapsedTime / 1000);
  console.log(`TPS: ${tps}`);
}

measureTPS();
