--
-- PostgreSQL database dump
--

\restrict RaU2H46GgcDCYsVnT5jWYg9XrEhpOx1sgnwS8jxRFRjECf2LdxtjYtf8dvAGZx6

-- Dumped from database version 17.10 (6a49db4)
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: listas_tareas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listas_tareas (
    id integer NOT NULL,
    nombre character varying(200) NOT NULL,
    descripcion text,
    color_default character varying(20) DEFAULT '#10B981'::character varying NOT NULL,
    owner_id integer NOT NULL,
    fecha_creacion timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: listas_tareas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.listas_tareas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: listas_tareas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.listas_tareas_id_seq OWNED BY public.listas_tareas.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: tareas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tareas (
    id integer NOT NULL,
    lista_id integer NOT NULL,
    owner_id integer NOT NULL,
    fecha date NOT NULL,
    nombre character varying(300) NOT NULL,
    descripcion text,
    hora_inicio character varying(5) NOT NULL,
    hora_fin character varying(5) NOT NULL,
    color character varying(20) DEFAULT '#10B981'::character varying NOT NULL,
    completada boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: tareas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tareas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tareas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tareas_id_seq OWNED BY public.tareas.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(200) NOT NULL,
    email character varying(200) NOT NULL,
    password_hash text NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    rol_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: listas_tareas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listas_tareas ALTER COLUMN id SET DEFAULT nextval('public.listas_tareas_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: tareas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tareas ALTER COLUMN id SET DEFAULT nextval('public.tareas_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
5a229838-e421-4d16-a391-724eeb8aeea1	b67dfd44c492c758f4d311a5de8e9087247cf419672adfe3b8af50dbd08d8dd7	2026-06-02 20:03:27.331986+00	20260601172732_init	\N	\N	2026-06-02 20:03:26.765493+00	1
\.


--
-- Data for Name: listas_tareas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.listas_tareas (id, nombre, descripcion, color_default, owner_id, fecha_creacion, updated_at) FROM stdin;
1	Trabajo	Tareas y reuniones del día	#004254	1	2026-06-02 20:03:39.42	2026-06-02 20:03:39.42
2	Personal	Pausas y pendientes propios	#8661F5	1	2026-06-02 20:03:39.586	2026-06-02 20:03:39.586
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, nombre) FROM stdin;
1	Administrador
2	Empleado
\.


--
-- Data for Name: tareas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tareas (id, lista_id, owner_id, fecha, nombre, descripcion, hora_inicio, hora_fin, color, completada, created_at, updated_at) FROM stdin;
1	1	1	2026-06-02	Colsubsidio	\N	08:00	09:00	#004254	f	2026-06-02 20:03:39.686	2026-06-02 20:03:39.686
2	1	1	2026-06-02	Agente	\N	09:00	09:30	#44B757	f	2026-06-02 20:03:39.686	2026-06-02 20:03:39.686
3	1	1	2026-06-02	ODTT-32310	\N	09:30	10:30	#8661F5	f	2026-06-02 20:03:39.686	2026-06-02 20:03:39.686
4	2	1	2026-06-02	Almuerzo	\N	12:00	13:00	#C0392B	f	2026-06-02 20:03:39.686	2026-06-02 20:03:39.686
5	1	1	2026-06-02	Revisión de PRs	\N	15:00	16:30	#E56813	f	2026-06-02 20:03:39.686	2026-06-02 20:03:39.686
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuarios (id, nombre, email, password_hash, activo, rol_id, created_at, updated_at) FROM stdin;
1	Administrador	admin@local	$2b$10$BsMW79yrpcLJuXmN2hvZFehdx6pEFTWoJqTu9IrdjOwYM8bCQ0U6O	t	1	2026-06-02 20:03:38.268	2026-06-02 20:03:38.268
2	Jeison	jeison@daily.com	$2b$10$msjt1OINee.ad7orJg8R6u7..RLWIzHuZXqWw7sLMIL6jYtBDYSBS	t	1	2026-06-02 20:03:39.007	2026-06-02 20:03:39.007
\.


--
-- Name: listas_tareas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.listas_tareas_id_seq', 2, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_seq', 2, true);


--
-- Name: tareas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tareas_id_seq', 5, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 2, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: listas_tareas listas_tareas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listas_tareas
    ADD CONSTRAINT listas_tareas_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: tareas tareas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT tareas_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: listas_tareas_owner_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX listas_tareas_owner_id_idx ON public.listas_tareas USING btree (owner_id);


--
-- Name: roles_nombre_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX roles_nombre_key ON public.roles USING btree (nombre);


--
-- Name: tareas_lista_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tareas_lista_id_idx ON public.tareas USING btree (lista_id);


--
-- Name: tareas_owner_id_fecha_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tareas_owner_id_fecha_idx ON public.tareas USING btree (owner_id, fecha);


--
-- Name: usuarios_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX usuarios_email_key ON public.usuarios USING btree (email);


--
-- Name: listas_tareas listas_tareas_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listas_tareas
    ADD CONSTRAINT listas_tareas_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tareas tareas_lista_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT tareas_lista_id_fkey FOREIGN KEY (lista_id) REFERENCES public.listas_tareas(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tareas tareas_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT tareas_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: usuarios usuarios_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict RaU2H46GgcDCYsVnT5jWYg9XrEhpOx1sgnwS8jxRFRjECf2LdxtjYtf8dvAGZx6

