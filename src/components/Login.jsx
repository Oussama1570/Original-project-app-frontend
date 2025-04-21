import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import "../Styles/StylesLogin.css";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [message, setMessage] = useState("");
  const { loginUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { t } = useTranslation();

  const showSuccessAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: "success",
      confirmButtonColor: "#8B5C3E",
      confirmButtonText: t("login.continue_shopping"),
      timer: 2000,
      showClass: { popup: "animate__animated animate__fadeInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" }
    });
  };

  const showErrorAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: "error",
      confirmButtonColor: "#d33",
      confirmButtonText: t("login.try_again"),
      showClass: { popup: "animate__animated animate__shakeX" },
      hideClass: { popup: "animate__animated animate__fadeOut" }
    });
  };

  const onSubmit = async (data) => {
    try {
      await loginUser(data.email, data.password);
      showSuccessAlert(t("login.success_title"), t("login.success_text"));
      navigate("/");
    } catch (error) {
      showErrorAlert(t("login.error_title"), t("login.error_text"));
      console.error(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      showSuccessAlert(t("login.google_success_title"), t("login.success_text"));
      navigate("/");
    } catch (error) {
      showErrorAlert(t("login.google_error_title"), t("login.try_again"));
      console.error(error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">{t("login.title")}</h2>

        {message && <p className="login-message">{message}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <label htmlFor="email">{t("login.email_label")}</label>
            <input
              {...register("email", { required: true })}
              type="email"
              id="email"
              placeholder={t("login.email_placeholder")}
            />
            {errors.email && <p className="error-text">{t("login.email_required")}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">{t("login.password_label")}</label>
            <input
              {...register("password", { required: true })}
              type="password"
              id="password"
              placeholder={t("login.password_placeholder")}
            />
            {errors.password && <p className="error-text">{t("login.password_required")}</p>}
          </div>

          <button type="submit" className="login-btn">
            {t("login.login_btn")}
          </button>
        </form>

        <p className="login-footer-link">
          {t("login.no_account")}{" "}
          <Link to="/register" className="login-link">
            {t("login.register_link")}
          </Link>
        </p>

        <div className="google-login">
          <button onClick={handleGoogleSignIn} className="google-btn">
            <FaGoogle className="google-icon" />
            {t("login.google_btn")}
          </button>
        </div>

        <p className="login-rights">
          ©2025 Oussama Graphics. {t("login.rights")}
        </p>
      </div>
    </div>
  );
};

export default Login;
