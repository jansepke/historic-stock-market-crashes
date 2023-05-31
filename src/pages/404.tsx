import Error from "next/error";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Error404 = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return <Error statusCode={404} title="This page could not be found. Redirecting..." />;
};

export default Error404;
