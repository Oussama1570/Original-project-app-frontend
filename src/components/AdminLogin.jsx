import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import getBaseUrl from "../utils/baseURL";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../Styles/StylesAdminLogin.css"
const AdminLogin = () => {
  const [message, setMessage] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const showSuccessAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: "success",
      confirmButtonColor: "#3b82f6",
      confirmButtonText: t("admin.enter_dashboard"),
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
      confirmButtonText: t("admin.try_again"),
      showClass: { popup: "animate__animated animate__shakeX" },
      hideClass: { popup: "animate__animated animate__fadeOut" }
    });
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${getBaseUrl()}/api/auth/admin`, data, {
        headers: { "Content-Type": "application/json" },
      });
      const auth = response.data;

      if (auth.token) {
        localStorage.setItem("token", auth.token);
        setTimeout(() => {
          localStorage.removeItem("token");
          showErrorAlert(t("admin.session_expired_title"), t("admin.session_expired_text"));
          navigate("/");
        }, 3600 * 1000);
      }

      showSuccessAlert(t("admin.success_title"), t("admin.success_text"));
      navigate("/dashboard");
    } catch (error) {
      showErrorAlert(t("admin.error_title"), t("admin.error_text"));
      console.error(error);
    }
  };

  return (
    <div className="admin-login-page" dir={isRTL ? "rtl" : "ltr"}>
      <div className="admin-login-box">
        <h2 className="admin-login-title">{t("admin.title")}</h2>

        {message && <p className="admin-error">{message}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="admin-login-form">
          <div>
            <label htmlFor="username">{t("admin.username_label")}</label>
            <input
              {...register("username", { required: true })}
              type="text"
              id="username"
              placeholder={t("admin.username_placeholder")}
            />
            {errors.username && (
              <p className="admin-error">{t("admin.username_required")}</p>
            )}
          </div>

          <div>
            <label htmlFor="password">{t("admin.password_label")}</label>
            <input
              {...register("password", { required: true })}
              type="password"
              id="password"
              placeholder={t("admin.password_placeholder")}
            />
            {errors.password && (
              <p className="admin-error">{t("admin.password_required")}</p>
            )}
          </div>

          <button type="submit" className="admin-login-btn">
            {t("admin.login_btn")}
          </button>
        </form>

        <p className="admin-login-footer">
          ©2025 Oussama Graphics. {t("admin.rights")}
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
