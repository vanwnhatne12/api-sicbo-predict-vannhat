import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/last-results", async (req, res) => {
  try {
    const gameId = "ktrng_3979";
    const size = "1"; // lấy 1 phiên mới nhất
    const tableId = "39791215743193";
    const curPage = "1";

    const apiUrl = `https://api.wsktnus8.net/v2/history/getLastResult?gameId=${gameId}&size=${size}&tableId=${tableId}&curPage=${curPage}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    const item = data?.data?.resultList?.[0];
    if (!item) {
      return res.status(404).json({ success: false, error: "Không có dữ liệu" });
    }

    const gameNum = parseInt(item.gameNum.replace("#", ""));
    const score = item.score;
    const facesList = item.facesList;

    // Kết quả
    const ket_qua = score <= 10 ? "Xỉu" : "Tài";

    // Random dự đoán
    const du_doan = Math.random() < 0.5 ? "Tài" : "Xỉu";

    // Random 3 tổng theo dự đoán
    let doan_vi;
    if (du_doan === "Tài") {
      doan_vi = Array.from({ length: 3 }, () => Math.floor(Math.random() * (18 - 11 + 1)) + 11);
    } else {
      doan_vi = Array.from({ length: 3 }, () => Math.floor(Math.random() * (10 - 3 + 1)) + 3);
    }

    // Random độ tin cậy 40 - 100%
    const do_tin_cay = `${Math.floor(Math.random() * (100 - 40 + 1)) + 40}%`;

    const result = {
      id: "Tele@Idol_VanNhat", // 👈 Thêm id ở đây
      phien_truoc: gameNum,
      xuc_xac: facesList,
      tong: score,
      ket_qua,
      phien_sau: gameNum + 1,
      du_doan,
      doan_vi,
      do_tin_cay,
    };

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
