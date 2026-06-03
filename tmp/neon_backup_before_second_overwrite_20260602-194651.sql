--
-- PostgreSQL database dump
--

\restrict i1j8sEa3ecgpcH4CB7bxLlWiM3L2su7YXFOcR2D8LFwOGyRDfLO66scxo1g7She

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


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
19ea44f0-53b4-407b-a181-fa9934b74a08	b67dfd44c492c758f4d311a5de8e9087247cf419672adfe3b8af50dbd08d8dd7	2026-06-01 17:27:32.929174+00	20260601172732_init	\N	\N	2026-06-01 17:27:32.82914+00	1
\.


--
-- Data for Name: listas_tareas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.listas_tareas (id, nombre, descripcion, color_default, owner_id, fecha_creacion, updated_at) FROM stdin;
2	Pausa medio dia 	Pausas y pendientes propios	#0011ff	2	2026-06-01 17:27:45.569	2026-06-02 02:09:42.654
3	ODTT-8455	\N	#2aeaaa	2	2026-06-01 20:35:03.18	2026-06-01 20:35:03.18
4	Colsubsidio	desarrollo 	#0067b1	2	2026-06-01 20:41:08.266	2026-06-02 02:09:24.962
5	Agente dev	iniciativa agente desarrollo 	#b1b30f	2	2026-06-01 23:55:49.621	2026-06-01 23:55:49.621
6	ODTT-32310	desarrollo 	#b7108a	2	2026-06-02 00:48:53.752	2026-06-02 01:39:12.955
7	Semillero	Plan Semillero	#10B981	2	2026-06-02 00:54:37.333	2026-06-02 00:54:37.333
8	Coltel	agente chatbox	#d87656	2	2026-06-02 01:45:42.195	2026-06-02 01:45:42.195
9	General	Lista por defecto	#004254	5	2026-06-02 03:36:20.633	2026-06-02 03:36:20.633
10	General	Lista por defecto	#004254	6	2026-06-02 03:36:20.643	2026-06-02 03:36:20.643
11	General	Lista por defecto	#004254	7	2026-06-02 03:36:20.652	2026-06-02 03:36:20.652
12	Trabajo	Tareas y reuniones del día	#004254	1	2026-06-02 20:06:27.459	2026-06-02 20:06:27.459
13	Personal	Pausas y pendientes propios	#8661F5	1	2026-06-02 20:06:27.47	2026-06-02 20:06:27.47
14	GD-8600	desarrollo 	#10B981	1	2026-06-03 00:44:46.879	2026-06-03 00:44:46.879
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
9	3	2	2026-06-01	URG- Revisión Estimación		12:00	13:00	#2aeaaa	t	2026-06-01 18:49:46.064	2026-06-02 01:15:35.864
8	4	2	2026-06-01	Sprint plannig		11:00	12:00	#5e16ca	t	2026-06-01 18:49:16.181	2026-06-02 01:15:23.206
14	4	2	2026-06-01	Organización - Trabajo	Reunion Organización - Trabajo Colsubsidio	14:00	15:30	#5e16ca	t	2026-06-02 01:24:04.842	2026-06-02 01:24:24.153
13	5	2	2026-06-01	Prueba ODTT-32476	Prueba + agente odtt-32476	16:00	19:00	#b1b30f	t	2026-06-02 01:00:18.087	2026-06-02 01:15:46.016
7	5	2	2026-06-01	Prueba ODTT-32476		10:00	11:00	#b1b30f	t	2026-06-01 18:48:46.686	2026-06-02 01:15:15.608
3	6	2	2026-06-01	Revisión-32310		09:30	10:00	#10B981	t	2026-06-01 17:27:45.573	2026-06-02 01:15:12.662
12	7	2	2026-06-01	Semillero Daily		15:30	16:00	#10B981	t	2026-06-01 20:29:46.13	2026-06-02 01:26:50.819
10	2	2	2026-06-01	Almuerzo		13:00	14:00	#8661F5	t	2026-06-01 18:50:13.34	2026-06-02 01:15:38.957
2	5	2	2026-06-01	Prueba planificador		09:00	09:30	#b1b30f	t	2026-06-01 17:27:45.573	2026-06-02 01:39:28.176
15	8	2	2026-06-01	integracion api	integracion api coltail	19:00	20:30	#d87656	t	2026-06-02 01:46:23.395	2026-06-02 01:46:39.547
17	5	2	2026-06-02	Iniciativa Agente DevIa	Revisión Iniciativa Agente DevIade Bugs	09:00	10:00	#b1b30f	f	2026-06-02 02:04:31.893	2026-06-02 02:05:16.719
18	8	2	2026-06-02	Prueba de ajustes SuperAgente	Prueba de ajustes SuperAgente	10:00	11:00	#d87656	f	2026-06-02 02:05:36.956	2026-06-02 02:05:36.956
19	5	2	2026-06-02	Iniciativa Agente DevIa	Iniciativa Agente DevIa	11:00	12:00	#b1b30f	f	2026-06-02 02:07:04.061	2026-06-02 02:07:04.061
16	4	2	2026-06-02	Revisión de Bugs	Revisión de Bugs	08:00	09:00	#0067b1	t	2026-06-02 02:03:42.637	2026-06-02 13:58:31.203
21	12	1	2026-06-02	Colsubsidio	\N	08:00	09:00	#004254	f	2026-06-02 20:06:27.475	2026-06-02 20:06:27.475
22	12	1	2026-06-02	Agente	\N	09:00	09:30	#44B757	f	2026-06-02 20:06:27.475	2026-06-02 20:06:27.475
23	12	1	2026-06-02	ODTT-32310	\N	09:30	10:30	#8661F5	f	2026-06-02 20:06:27.475	2026-06-02 20:06:27.475
24	13	1	2026-06-02	Almuerzo	\N	12:00	13:00	#C0392B	f	2026-06-02 20:06:27.475	2026-06-02 20:06:27.475
25	12	1	2026-06-02	Revisión de PRs	\N	15:00	16:30	#E56813	f	2026-06-02 20:06:27.475	2026-06-02 20:06:27.475
26	6	2	2026-06-02	ODTT-32310 Revisión Requirimiento	ODTT-32310 Revisión Requirimiento	12:00	12:30	#b7108a	f	2026-06-03 00:40:50.191	2026-06-03 00:40:50.191
27	2	2	2026-06-02	Almuerzo	medio dia	12:30	13:30	#0011ff	f	2026-06-03 00:42:12.581	2026-06-03 00:42:12.581
28	5	2	2026-06-02	Agente prueba Mau-v2	Agente prueba Mau-v2	12:30	14:00	#b1b30f	f	2026-06-03 00:44:01.562	2026-06-03 00:44:01.562
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuarios (id, nombre, email, password_hash, activo, rol_id, created_at, updated_at) FROM stdin;
1	Administrador	admin@local	$2b$10$nQeX/at3wYZ9x.qv9reI6uew9MQWoZ3FxKUxvwJ0bHrIS71OTFysG	t	1	2026-06-01 17:27:45.555	2026-06-01 17:27:45.555
2	Jeison	jeison@daily.com	$2b$10$7qteNeQi24slbJaAPBlwauppw2Dk2gtAtYvPEQQEgWwNVRDBSMBbG	t	2	2026-06-02 02:18:07.122	2026-06-02 02:36:42.238
5	L.S. Ortiz P.	lsortizp@daily.com	$2b$10$GaAwCd2l4iVjo.D3zM5wTeBGBOP5rCYS9e4F2lOUbTxy3RYSBRx9y	t	2	2026-06-02 03:36:20.621	2026-06-02 03:36:20.621
6	A.F. Cáceres	afcaceres@daily.com	$2b$10$GaAwCd2l4iVjo.D3zM5wTeBGBOP5rCYS9e4F2lOUbTxy3RYSBRx9y	t	2	2026-06-02 03:36:20.638	2026-06-02 03:36:20.638
7	C.S. Martínez H.	csmartinezh@daily.com	$2b$10$GaAwCd2l4iVjo.D3zM5wTeBGBOP5rCYS9e4F2lOUbTxy3RYSBRx9y	t	2	2026-06-02 03:36:20.647	2026-06-02 03:36:20.647
\.


--
-- Name: listas_tareas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.listas_tareas_id_seq', 14, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_seq', 2, true);


--
-- Name: tareas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tareas_id_seq', 28, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 7, true);


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

\unrestrict i1j8sEa3ecgpcH4CB7bxLlWiM3L2su7YXFOcR2D8LFwOGyRDfLO66scxo1g7She

