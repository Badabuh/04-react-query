import styles from "./SearchBar.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          className={styles.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>
        <Formik
          initialValues={{ query: "" }}
          onSubmit={async (values: { query: string }) => {
            onSubmit(values.query);
          }}
          validationSchema={Yup.object({
            query: Yup.string().required("Please enter a search query"),
          })}
        >
          {({ isSubmitting }) => (
            <Form className={styles.form}>
              <Field
                className={styles.input}
                type="text"
                name="query"
                autoComplete="off"
                placeholder="Search movies..."
                autoFocus
              />
              <button
                className={styles.button}
                type="submit"
                disabled={isSubmitting}
              >
                Search
              </button>
              <ErrorMessage
                name="query"
                component="p"
                className={styles.error}
              />
            </Form>
          )}
        </Formik>
      </div>
    </header>
  );
}
