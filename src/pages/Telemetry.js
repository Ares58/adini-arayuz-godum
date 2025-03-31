import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/global.css";
import "../styles/components/telemetry.css";
const Telemetry = () => {
  const [telemetryData, setTelemetryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchTelemetry = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/telemetry", {
          signal,
        });
        setTelemetryData((prevData) =>
          JSON.stringify(prevData) !== JSON.stringify(response.data)
            ? response.data
            : prevData
        );
        setLoading(false);
        setError(null);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("İstek iptal edildi.");
        } else {
          console.error("Telemetri verisi alınırken hata oluştu:", error);
          setError("Telemetri verisi alınırken bir hata oluştu.");
          setLoading(false);
        }
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 1000);

    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, []);

  return (
    <div className="telemetry-wrapper">
      {/* Yeşil Konteynır (Ekstra Bilgiler) */}
      <div className="telemetry-container green-container">
        <h3>YEŞİL KONTEYNIR</h3>
        <p>Buraya ekstra bilgiler eklenebilir.</p>
      </div>
      {/* Kırmızı Konteynır (Telemetri Verileri) */}
      <div className="telemetry-container red-container">
        {loading ? (
          <div className="error-message">Telemetri verisi yükleniyor...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="telemetry-content">
            {telemetryData && (
              <>
                <p>
                  <strong>Takım Numarası:</strong>{" "}
                  {telemetryData.takim_numarasi}
                </p>
                <p>
                  <strong>Hedef Merkez X:</strong>{" "}
                  {telemetryData.hedef_merkez_X}
                </p>
                <p>
                  <strong>Hedef Merkez Y:</strong>{" "}
                  {telemetryData.hedef_merkez_Y}
                </p>
                <p>
                  <strong>Hedef Genişlik:</strong>{" "}
                  {telemetryData.hedef_genislik}
                </p>
                <p>
                  <strong>Hedef Yükseklik:</strong>{" "}
                  {telemetryData.hedef_yukseklik}
                </p>
                <p>
                  <strong>İHA Enlem:</strong> {telemetryData.iha_enlem}
                </p>
                <p>
                  <strong>İHA Boylam:</strong> {telemetryData.iha_boylam}
                </p>
                <p>
                  <strong>İHA Yükseklik:</strong> {telemetryData.iha_irtifa}
                </p>
                <p>
                  <strong>İHA Dikilme:</strong> {telemetryData.iha_dikilme}
                </p>
                <p>
                  <strong>İHA Yatış:</strong> {telemetryData.iha_yatis}°
                </p>
                <p>
                  <strong>İHA Yönelme:</strong> {telemetryData.iha_yonelme}
                </p>
                <p>
                  <strong>İHA Hız:</strong> {telemetryData.iha_hiz}
                </p>
                <p>
                  <strong>İHA Batarya:</strong> {telemetryData.iha_batarya}%
                </p>
                <p>
                  <strong>GPS Saati:</strong>{" "}
                  {telemetryData?.gps_saati?.saat ?? "00"}:
                  {telemetryData?.gps_saati?.dakika ?? "00"}:
                  {telemetryData?.gps_saati?.saniye ?? "00"}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Telemetry;
