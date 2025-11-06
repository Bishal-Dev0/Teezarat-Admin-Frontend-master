import React from "react";
import { Card, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Home.scss";
import HomeHeader from "./HomeHeader";
const Home = () => {
  return (
    <HomeHeader>
      <Carousel indicators={false}>
        <Carousel.Item>
          <img
            className="custom-carousel  d-block w-100"
            src="/assets/hero_banner.png"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="custom-carousel d-block w-100"
            src="assets/hero_banner.png"
            alt="Second slide"
          />
        </Carousel.Item>
      </Carousel>

      <div className="container">
        <div
          style={{
            border: "1px solid #DDDDDD",
            boxSizing: "border-box",
            boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.15)",
            borderRadius: "8px",
            position: "relative",
            top: "-40px",
            backgroundColor: "white",
          }}
          className="download-sec p-4  d-flex justify-content-center align-items-center flex-wrap"
        >
          <p
            className=""
            style={{
              fontWeight: "bold",
              fontSize: "24px",
              fontFamily: "PT Sans",
            }}
          >
            গুগোল প্লে স্টোর হতে আমাদের অ্যাপটি ডাউনলোড করুন!{" "}
          </p>
          <a
            href="https://play.google.com/store/apps/details?id=com.teezarate"
            target="_blank"
          >
            <img src="assets/play-store-logo.png" alt="play-store-logo" />
          </a>
        </div>

        <div className="text-center my-3">
          <h1
            style={{
              color: "#CB3201",
              fontWeight: "bold",
              fontFamily: "PT Sans",
              fontSize: "48px",
            }}
          >
            তিজারত : আস্থার বন্ধন
          </h1>
          <h3
            style={{
              color: "background: #333333",
              fontWeight: "bold",
              fontFamily: "PT Sans",
            }}
          >
            Ugharia Road, Chitoshi Bazar, Shahrasti, Chandpur
          </h3>
        </div>

        <div>
          <div className="row justify-content-center align-content-center">
            <div className="col-md-6 col-lg-4 col-12 text-center">
              <img src="assets/Furniture_logo.png" alt="Furniture_logo" />
            </div>
            <div className="text-end my-5 col-md-4 col-lg-8 col-12 ">
              <h3
                className="mb-3 d-flex justify-content-md-end"
                style={{ fontWeight: "bold" }}
              >
                আর নয় ইমামগঞ্জ, নবাবপুর, কুমিল্লা
              </h3>
              <br />
              <h5>
                আপনার ঘরবাড়ি নির্মানের সকল সরঞ্জাম এখন পাবেন চাদপুরেই! ঘরে বসে
                আমাদের অ্যাপটি ব্যবহার করে অর্ডার করুন টাইলস, স্যানিটারি, রড,
                সিমেন্ট, টিন, দরজা, ইলেক্ট্রিক সামগ্রী, পাইপ ফিটিংস, হার্ডওয়্যার
                সামগ্রী, মেশিনারিজসহ অনেক পন্য
              </h5>
              <div className="mb-3 d-flex justify-content-md-end">
                <a
                  href="https://play.google.com/store/apps/details?id=teezarate"
                  target="_blank"
                >
                  <button className="btn-primary px-5 d-flex justify-content-center align-items-center">
                    <img
                      src="assets/goTo_icon.png"
                      alt="goTo_icon"
                      className="mr-2"
                      height="20"
                    />
                    অ্যাপটি ডাউনলোড করুন{" "}
                  </button>
                </a>
              </div>
            </div>
          </div>

          <div className="row justify-content-center align-content-center">
            <div className="text-end my-5 col-md-4 col-lg-8 col-12 ">
              <h3
                className="mb-3 d-flex justify-content-start"
                style={{ fontWeight: "bold" }}
              >
                পাইকারী বা খুচরা{" "}
              </h3>
              <br />
              <h5>
                পাইকারী হোক বা খুচরা, ঘরে বসে অর্ডার করুন আর নিশ্চিন্তে পন্য
                পেয়ে যাবেন আপনার হাতে
              </h5>
              <div className="mb-3 mt-2 d-flex justify-content-start">
                <a
                  href="https://play.google.com/store/apps/details?id=com.teezarate"
                  target="_blank"
                >
                  <button className="btn-primary px-5 d-flex justify-content-center align-items-center">
                    <img
                      src="assets/goTo_icon.png"
                      alt="goTo_icon"
                      className="mr-2"
                      height="20"
                    />
                    অ্যাপটি ডাউনলোড করুন{" "}
                  </button>
                </a>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 col-12 text-center">
              <img src="assets/Furniture_logo.png" alt="Furniture_logo" />
            </div>
          </div>

          <div className="row justify-content-center align-content-center">
            <div className="col-md-6 col-lg-4 col-12 text-center">
              <img src="assets/Furniture_logo.png" alt="Furniture_logo" />
            </div>
            <div className="text-end my-5 col-md-4 col-lg-8 col-12 ">
              <h3
                className="mb-3 d-flex justify-content-md-end"
                style={{ fontWeight: "bold" }}
              >
                পাইকারী হোক বা খুচরা, ঘরে বসে অর্ডার করুন আর নিশ্চিন্তে পন্য
                পেয়ে যাবেন আপনার হাতে{" "}
              </h3>
              <br />
              <h5>
                তিজারত থেকে পণ্য নিন, আর লুফে নিন আকর্ষনীয় সব অফার ও পুরষ্কার
              </h5>
              <div className="mb-3 d-flex justify-content-md-end">
                <a
                  href="https://play.google.com/store/apps/details?id=com.teezarate"
                  target="_blank"
                >
                  <button className="btn-primary px-5 d-flex justify-content-center align-items-center">
                    <img
                      src="assets/goTo_icon.png"
                      alt="goTo_icon"
                      className="mr-2"
                      height="20"
                    />
                    অ্যাপটি ডাউনলোড করুন{" "}
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeHeader>
  );
};

export default Home;
