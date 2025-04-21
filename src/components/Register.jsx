import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import "../Styles/StylesRegister.css"

const Register = () => {
  const [message, setMessage] = useState("");
  const { registerUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { t } = useTranslation();

  const showSuccessAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: "success",
      confirmButtonColor: "#444",
      confirmButtonText: t("register.continue_shopping"),
      timer: 2000,
    });
  };

  const showErrorAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: "error",
      confirmButtonColor: "#d33",
      confirmButtonText: t("register.try_again"),
    });
  };

  const onSubmit = async (data) => {
    try {
      await registerUser(data.email, data.password);
      showSuccessAlert(t("register.success_title"), t("register.success_text"));
      navigate("/");
    } catch (error) {
      showErrorAlert(t("register.error_title"), t("register.error_text"));
      console.error(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      showSuccessAlert(t("register.google_success_title"), t("register.success_text"));
      navigate("/");
    } catch (error) {
      showErrorAlert(t("register.google_error_title"), t("register.try_again"));
      console.error(error);
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h2 className="register-title">{t("register.create_account")}</h2>

        {message && <p className="register-message">{message}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <div>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder={t("register.email_placeholder")}
              className="input"
            />
            {errors.email && <p className="input-error">{t("register.email_required")}</p>}
          </div>

          <div>
            <input
              {...register("password", { required: true })}
              type="password"
              placeholder={t("register.password_placeholder")}
              className="input"
            />
            {errors.password && <p className="input-error">{t("register.password_required")}</p>}
          </div>

          <button type="submit" className="btn-primary">
            {t("register.register_btn")}
          </button>
        </form>

        <p className="register-link">
          {t("register.have_account")}{" "}
          <Link to="/login" className="text-link">{t("register.login_link")}</Link>
        </p>

        <button onClick={handleGoogleSignIn} className="btn-google">
          <FaGoogle className="text-red-500" />
          {t("register.google_btn")}
        </button>

        <p className="register-footer">©2025 Wahret Zmen Boutique. {t("register.rights")}</p>
      </div>
    </div>
  );
};

export default Register;
