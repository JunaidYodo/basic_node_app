--
-- PostgreSQL database dump
--

-- Dumped from database version 12.22 (Ubuntu 12.22-0ubuntu0.20.04.4)
-- Dumped by pg_dump version 12.22 (Ubuntu 12.22-0ubuntu0.20.04.4)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth_log_type; Type: TYPE; Schema: public; Owner: moazzam
--

CREATE TYPE public.auth_log_type AS ENUM (
    'login',
    'logout',
    'password_reset',
    'email_verified'
);


ALTER TYPE public.auth_log_type OWNER TO moazzam;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: moazzam
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


ALTER TABLE public._prisma_migrations OWNER TO moazzam;

--
-- Name: analytics; Type: TABLE; Schema: public; Owner: moazzam
--

CREATE TABLE public.analytics (
    id integer NOT NULL,
    user_id integer NOT NULL,
    metric_type text NOT NULL,
    metric_value double precision NOT NULL,
    metadata jsonb,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.analytics OWNER TO moazzam;

--
-- Name: analytics_id_seq; Type: SEQUENCE; Schema: public; Owner: moazzam
--

CREATE SEQUENCE public.analytics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.analytics_id_seq OWNER TO moazzam;

--
-- Name: analytics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moazzam
--

ALTER SEQUENCE public.analytics_id_seq OWNED BY public.analytics.id;


--
-- Name: application_events; Type: TABLE; Schema: public; Owner: moazzam
--

CREATE TABLE public.application_events (
    id integer NOT NULL,
    application_id integer NOT NULL,
    event_type text NOT NULL,
    event_data jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.application_events OWNER TO moazzam;

--
-- Name: application_events_id_seq; Type: SEQUENCE; Schema: public; Owner: moazzam
--

CREATE SEQUENCE public.application_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.application_events_id_seq OWNER TO moazzam;

--
-- Name: application_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moazzam
--

ALTER SEQUENCE public.application_events_id_seq OWNED BY public.application_events.id;


--
-- Name: applications; Type: TABLE; Schema: public; Owner: moazzam
--

CREATE TABLE public.applications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    job_id integer NOT NULL,
    resume_version_id integer,
    cover_letter text,
    status text DEFAULT 'draft'::text NOT NULL,
    submission_method text,
    applied_at timestamp(3) without time zone,
    response_received_at timestamp(3) without time zone,
    interview_date timestamp(3) without time zone,
    offer_date timestamp(3) without time zone,
    rejection_date timestamp(3) without time zone,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.applications OWNER TO moazzam;

--
-- Name: applications_id_seq; Type: SEQUENCE; Schema: public; Owner: moazzam
--

CREATE SEQUENCE public.applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.applications_id_seq OWNER TO moazzam;

--
-- Name: applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moazzam
--

ALTER SEQUENCE public.applications_id_seq OWNED BY public.applications.id;


--
-- Name: auth_log; Type: TABLE; Schema: public; Owner: moazzam
--

CREATE TABLE public.auth_log (
    id integer NOT NULL,
    user_id integer NOT NULL,
    type public.auth_log_type DEFAULT 'login'::public.auth_log_type NOT NULL,
    ip_address text,
    user_agent text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.auth_log OWNER TO moazzam;

--
-- Name: auth_log_id_seq; Type: SEQUENCE; Schema: public; Owner: moazzam
--

CREATE SEQUENCE public.auth_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_log_id_seq OWNER TO moazzam;

--
-- Name: auth_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moazzam
--

ALTER SEQUENCE public.auth_log_id_seq OWNED BY public.auth_log.id;


--
-- Name: educations; Type: TABLE; Schema: public; Owner: moazzam
--

CREATE TABLE public.educations (
    id integer NOT NULL,
    profile_id integer NOT NULL,
    institution text NOT NULL,
    degree text NOT NULL,
    field text,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone,
    is_current boolean DEFAULT false NOT NULL,
    description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.educations OWNER TO moazzam;

--
-- Name: educations_id_seq; Type: SEQUENCE; Schema: public; Owner: moazzam
--

CREATE SEQUENCE public.educations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.educations_id_seq OWNER TO moazzam;

--
-- Name: educations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moazzam
--

ALTER SEQUENCE public.educations_id_seq OWNED BY public.educations.id;


--
-- Name: experiences; Type: TABLE; Schema: public; Owner: moazzam
--

CREATE TABLE public.experiences (
    id integer NOT NULL,
    profile_id integer NOT NULL,
    company text NOT NULL,
    title text NOT NULL,
    location text,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone,
    is_current boolean DEFAULT false NOT NULL,
    description text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.experiences OWNER TO moazzam;

--
-- Name: experiences_id_seq; Type: SEQUENCE; Schema: public; Owner: moazzam
--

CREATE SEQUENCE public.experiences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.experiences_id_seq OWNER TO moazzam;

--
-- Name: experiences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moazzam
--

ALTER SEQUENCE public.experiences_id_seq OWNED BY public.experiences.id;


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: moazzam
--

CREATE TABLE public.jobs (
    id integer NOT NULL,
    user_id integer NOT NULL,
    external_id text,
    source text NOT NULL,
    source_url text,
    company_name text NOT NULL,
    job_title text NOT NULL,
    location text,
    work_mode text,
    salary_range text,
    description text NOT NULL,
    requirements jsonb,
    benefits jsonb,
    posted_date timestamp(3) without time zone,
    deadline timestamp(3) without time zone,
    status text DEFAULT 'active'::text NOT NULL,
    ai_match_score integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.jobs OWNER TO moazzam;

--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: moazzam
--

CREATE SEQUENCE public.jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.jobs_id_seq OWNER TO moazzam;

--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moazzam
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: moazzam
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    link text,
    metadata jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.notifications OWNER TO moazzam;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: moazzam
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_id_seq OWNER TO moazzam;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moazzam
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: payment_history; Type: TABLE; Schema: public; Owner: moazzam
--

CREATE TABLE public.payment_history (
    id integer NOT NULL,
    user_id integer NOT NULL,
    stripe_payment_id text NOT NULL,
    stripe_invoice_id text,
    amount double precision NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    status text NOT NULL,
    payment_method text,
    description text,
    receipt_url text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.payment_history OWNER TO moazzam;

--
-- Name: payment_history_id_seq; Type: SEQUENCE; Schema: public; Owner: moazzam
--

CREATE SEQUENCE public.payment_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payment_history_id_seq OWNER TO moazzam;

--
-- Name: payment_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moazzam
--

ALTER SEQUENCE public.payment_history_id_seq OWNED BY public.payment_history.id;


--
-- Name: resumes; Type: TABLE; Schema: public; Owner: moazzam
--

CREATE TABLE public.resumes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name text NOT NULL,
    file_path text,
    file_url text,
    parsed_data jsonb,
    version integer DEFAULT 1 NOT NULL,
    is_master boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.resumes OWNER TO moazzam;

--
-- Name: resumes_id_seq; Type: SEQUENCE; Schema: public; Owner: moazzam
--

CREATE SEQUENCE public.resumes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.resumes_id_seq OWNER TO moazzam;

--
-- Name: resumes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moazzam
--

ALTER SEQUENCE public.resumes_id_seq OWNED BY public.resumes.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: moazzam
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted boolean DEFAULT false NOT NULL
);


ALTER TABLE public.roles OWNER TO moazzam;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: moazzam
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO moazzam;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moazzam
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: moazzam
--

CREATE TABLE public.subscriptions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    stripe_subscription_id text NOT NULL,
    stripe_customer_id text NOT NULL,
    stripe_price_id text NOT NULL,
    status text NOT NULL,
    plan_name text NOT NULL,
    current_period_start timestamp(3) without time zone NOT NULL,
    current_period_end timestamp(3) without time zone NOT NULL,
    cancel_at_period_end boolean DEFAULT false NOT NULL,
    canceled_at timestamp(3) without time zone,
    trial_start timestamp(3) without time zone,
    trial_end timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.subscriptions OWNER TO moazzam;

--
-- Name: subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: moazzam
--

CREATE SEQUENCE public.subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.subscriptions_id_seq OWNER TO moazzam;

--
-- Name: subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moazzam
--

ALTER SEQUENCE public.subscriptions_id_seq OWNED BY public.subscriptions.id;


--
-- Name: user_preferences; Type: TABLE; Schema: public; Owner: moazzam
--

CREATE TABLE public.user_preferences (
    id integer NOT NULL,
    user_id integer NOT NULL,
    email_notifications boolean DEFAULT true NOT NULL,
    application_reminders boolean DEFAULT true NOT NULL,
    weekly_summary boolean DEFAULT true NOT NULL,
    theme text DEFAULT 'light'::text NOT NULL,
    timezone text DEFAULT 'UTC'::text NOT NULL,
    language text DEFAULT 'en'::text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.user_preferences OWNER TO moazzam;

--
-- Name: user_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: moazzam
--

CREATE SEQUENCE public.user_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_preferences_id_seq OWNER TO moazzam;

--
-- Name: user_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moazzam
--

ALTER SEQUENCE public.user_preferences_id_seq OWNED BY public.user_preferences.id;


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: moazzam
--

CREATE TABLE public.user_profiles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    headline text,
    summary text,
    skills jsonb,
    linkedin_url text,
    github_url text,
    portfolio_url text,
    preferred_roles jsonb,
    preferred_locations jsonb,
    work_mode text,
    salary_min integer,
    salary_max integer,
    currency text DEFAULT 'USD'::text,
    completeness integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.user_profiles OWNER TO moazzam;

--
-- Name: user_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: moazzam
--

CREATE SEQUENCE public.user_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_profiles_id_seq OWNER TO moazzam;

--
-- Name: user_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moazzam
--

ALTER SEQUENCE public.user_profiles_id_seq OWNED BY public.user_profiles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: moazzam
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    role_id integer NOT NULL,
    status text NOT NULL,
    gender text,
    number text,
    password text NOT NULL,
    remember_token text,
    deleted boolean DEFAULT false NOT NULL,
    created_by integer,
    lat_long text,
    postal_code text,
    address text,
    city text,
    country text,
    image text,
    state text,
    birth_date date,
    last_login timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    stripe_customer_id text,
    stripe_subscription_id text,
    subscription_status text DEFAULT 'free'::text,
    subscription_plan text DEFAULT 'free'::text,
    subscription_start timestamp(3) without time zone,
    subscription_end timestamp(3) without time zone,
    trial_ends_at timestamp(3) without time zone,
    applications_used integer DEFAULT 0 NOT NULL,
    applications_limit integer DEFAULT 5 NOT NULL,
    ai_generations_used integer DEFAULT 0 NOT NULL,
    ai_generations_limit integer DEFAULT 10 NOT NULL,
    onboarding_completed boolean DEFAULT false NOT NULL,
    onboarding_step integer DEFAULT 0 NOT NULL,
    onboarding_data jsonb
);


ALTER TABLE public.users OWNER TO moazzam;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: moazzam
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO moazzam;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moazzam
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: analytics id; Type: DEFAULT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.analytics ALTER COLUMN id SET DEFAULT nextval('public.analytics_id_seq'::regclass);


--
-- Name: application_events id; Type: DEFAULT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.application_events ALTER COLUMN id SET DEFAULT nextval('public.application_events_id_seq'::regclass);


--
-- Name: applications id; Type: DEFAULT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.applications ALTER COLUMN id SET DEFAULT nextval('public.applications_id_seq'::regclass);


--
-- Name: auth_log id; Type: DEFAULT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.auth_log ALTER COLUMN id SET DEFAULT nextval('public.auth_log_id_seq'::regclass);


--
-- Name: educations id; Type: DEFAULT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.educations ALTER COLUMN id SET DEFAULT nextval('public.educations_id_seq'::regclass);


--
-- Name: experiences id; Type: DEFAULT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.experiences ALTER COLUMN id SET DEFAULT nextval('public.experiences_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: payment_history id; Type: DEFAULT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.payment_history ALTER COLUMN id SET DEFAULT nextval('public.payment_history_id_seq'::regclass);


--
-- Name: resumes id; Type: DEFAULT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.resumes ALTER COLUMN id SET DEFAULT nextval('public.resumes_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: subscriptions id; Type: DEFAULT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.subscriptions ALTER COLUMN id SET DEFAULT nextval('public.subscriptions_id_seq'::regclass);


--
-- Name: user_preferences id; Type: DEFAULT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.user_preferences ALTER COLUMN id SET DEFAULT nextval('public.user_preferences_id_seq'::regclass);


--
-- Name: user_profiles id; Type: DEFAULT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.user_profiles ALTER COLUMN id SET DEFAULT nextval('public.user_profiles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: moazzam
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
66f3baec-82a5-4e36-8fcc-0eab7026c482	9f05902996d567319f84053cdea061cc22d3af96a52e88db78de70e21891ba3a	2025-12-16 14:12:40.009257+05	20251107100306_init	\N	\N	2025-12-16 14:12:39.727196+05	1
4818c532-ffa4-495e-8bd5-9406c657aca7	633a08dae1932e43d170d0e1932af8627ab2547ff2f1a917be6b88ed376d79ed	2025-12-16 14:12:40.019596+05	20251216090840_remove_ai_logs_and_ai_variants	\N	\N	2025-12-16 14:12:40.010645+05	1
\.


--
-- Data for Name: analytics; Type: TABLE DATA; Schema: public; Owner: moazzam
--

COPY public.analytics (id, user_id, metric_type, metric_value, metadata, date) FROM stdin;
\.


--
-- Data for Name: application_events; Type: TABLE DATA; Schema: public; Owner: moazzam
--

COPY public.application_events (id, application_id, event_type, event_data, created_at) FROM stdin;
\.


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: moazzam
--

COPY public.applications (id, user_id, job_id, resume_version_id, cover_letter, status, submission_method, applied_at, response_received_at, interview_date, offer_date, rejection_date, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: auth_log; Type: TABLE DATA; Schema: public; Owner: moazzam
--

COPY public.auth_log (id, user_id, type, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- Data for Name: educations; Type: TABLE DATA; Schema: public; Owner: moazzam
--

COPY public.educations (id, profile_id, institution, degree, field, start_date, end_date, is_current, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: experiences; Type: TABLE DATA; Schema: public; Owner: moazzam
--

COPY public.experiences (id, profile_id, company, title, location, start_date, end_date, is_current, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: moazzam
--

COPY public.jobs (id, user_id, external_id, source, source_url, company_name, job_title, location, work_mode, salary_range, description, requirements, benefits, posted_date, deadline, status, ai_match_score, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: moazzam
--

COPY public.notifications (id, user_id, type, title, message, is_read, link, metadata, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payment_history; Type: TABLE DATA; Schema: public; Owner: moazzam
--

COPY public.payment_history (id, user_id, stripe_payment_id, stripe_invoice_id, amount, currency, status, payment_method, description, receipt_url, created_at) FROM stdin;
\.


--
-- Data for Name: resumes; Type: TABLE DATA; Schema: public; Owner: moazzam
--

COPY public.resumes (id, user_id, name, file_path, file_url, parsed_data, version, is_master, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: moazzam
--

COPY public.roles (id, name, description, created_at, updated_at, deleted) FROM stdin;
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: moazzam
--

COPY public.subscriptions (id, user_id, stripe_subscription_id, stripe_customer_id, stripe_price_id, status, plan_name, current_period_start, current_period_end, cancel_at_period_end, canceled_at, trial_start, trial_end, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_preferences; Type: TABLE DATA; Schema: public; Owner: moazzam
--

COPY public.user_preferences (id, user_id, email_notifications, application_reminders, weekly_summary, theme, timezone, language, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: moazzam
--

COPY public.user_profiles (id, user_id, headline, summary, skills, linkedin_url, github_url, portfolio_url, preferred_roles, preferred_locations, work_mode, salary_min, salary_max, currency, completeness, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: moazzam
--

COPY public.users (id, name, email, role_id, status, gender, number, password, remember_token, deleted, created_by, lat_long, postal_code, address, city, country, image, state, birth_date, last_login, created_at, updated_at, stripe_customer_id, stripe_subscription_id, subscription_status, subscription_plan, subscription_start, subscription_end, trial_ends_at, applications_used, applications_limit, ai_generations_used, ai_generations_limit, onboarding_completed, onboarding_step, onboarding_data) FROM stdin;
\.


--
-- Name: analytics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moazzam
--

SELECT pg_catalog.setval('public.analytics_id_seq', 1, false);


--
-- Name: application_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moazzam
--

SELECT pg_catalog.setval('public.application_events_id_seq', 1, false);


--
-- Name: applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moazzam
--

SELECT pg_catalog.setval('public.applications_id_seq', 1, false);


--
-- Name: auth_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moazzam
--

SELECT pg_catalog.setval('public.auth_log_id_seq', 1, false);


--
-- Name: educations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moazzam
--

SELECT pg_catalog.setval('public.educations_id_seq', 1, false);


--
-- Name: experiences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moazzam
--

SELECT pg_catalog.setval('public.experiences_id_seq', 1, false);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moazzam
--

SELECT pg_catalog.setval('public.jobs_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moazzam
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: payment_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moazzam
--

SELECT pg_catalog.setval('public.payment_history_id_seq', 1, false);


--
-- Name: resumes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moazzam
--

SELECT pg_catalog.setval('public.resumes_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moazzam
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moazzam
--

SELECT pg_catalog.setval('public.subscriptions_id_seq', 1, false);


--
-- Name: user_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moazzam
--

SELECT pg_catalog.setval('public.user_preferences_id_seq', 1, false);


--
-- Name: user_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moazzam
--

SELECT pg_catalog.setval('public.user_profiles_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moazzam
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: analytics analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.analytics
    ADD CONSTRAINT analytics_pkey PRIMARY KEY (id);


--
-- Name: application_events application_events_pkey; Type: CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.application_events
    ADD CONSTRAINT application_events_pkey PRIMARY KEY (id);


--
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- Name: auth_log auth_log_pkey; Type: CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.auth_log
    ADD CONSTRAINT auth_log_pkey PRIMARY KEY (id);


--
-- Name: educations educations_pkey; Type: CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.educations
    ADD CONSTRAINT educations_pkey PRIMARY KEY (id);


--
-- Name: experiences experiences_pkey; Type: CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT experiences_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: payment_history payment_history_pkey; Type: CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT payment_history_pkey PRIMARY KEY (id);


--
-- Name: resumes resumes_pkey; Type: CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.resumes
    ADD CONSTRAINT resumes_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: user_preferences user_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: analytics_date_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX analytics_date_idx ON public.analytics USING btree (date);


--
-- Name: analytics_metric_type_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX analytics_metric_type_idx ON public.analytics USING btree (metric_type);


--
-- Name: analytics_user_id_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX analytics_user_id_idx ON public.analytics USING btree (user_id);


--
-- Name: application_events_application_id_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX application_events_application_id_idx ON public.application_events USING btree (application_id);


--
-- Name: applications_job_id_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX applications_job_id_idx ON public.applications USING btree (job_id);


--
-- Name: applications_status_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX applications_status_idx ON public.applications USING btree (status);


--
-- Name: applications_user_id_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX applications_user_id_idx ON public.applications USING btree (user_id);


--
-- Name: auth_log_user_id_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX auth_log_user_id_idx ON public.auth_log USING btree (user_id);


--
-- Name: educations_profile_id_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX educations_profile_id_idx ON public.educations USING btree (profile_id);


--
-- Name: experiences_profile_id_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX experiences_profile_id_idx ON public.experiences USING btree (profile_id);


--
-- Name: jobs_source_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX jobs_source_idx ON public.jobs USING btree (source);


--
-- Name: jobs_status_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX jobs_status_idx ON public.jobs USING btree (status);


--
-- Name: jobs_user_id_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX jobs_user_id_idx ON public.jobs USING btree (user_id);


--
-- Name: notifications_is_read_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX notifications_is_read_idx ON public.notifications USING btree (is_read);


--
-- Name: notifications_user_id_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX notifications_user_id_idx ON public.notifications USING btree (user_id);


--
-- Name: payment_history_stripe_payment_id_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX payment_history_stripe_payment_id_idx ON public.payment_history USING btree (stripe_payment_id);


--
-- Name: payment_history_stripe_payment_id_key; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE UNIQUE INDEX payment_history_stripe_payment_id_key ON public.payment_history USING btree (stripe_payment_id);


--
-- Name: payment_history_user_id_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX payment_history_user_id_idx ON public.payment_history USING btree (user_id);


--
-- Name: resumes_is_master_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX resumes_is_master_idx ON public.resumes USING btree (is_master);


--
-- Name: resumes_user_id_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX resumes_user_id_idx ON public.resumes USING btree (user_id);


--
-- Name: roles_name_key; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE UNIQUE INDEX roles_name_key ON public.roles USING btree (name);


--
-- Name: subscriptions_stripe_subscription_id_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX subscriptions_stripe_subscription_id_idx ON public.subscriptions USING btree (stripe_subscription_id);


--
-- Name: subscriptions_stripe_subscription_id_key; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE UNIQUE INDEX subscriptions_stripe_subscription_id_key ON public.subscriptions USING btree (stripe_subscription_id);


--
-- Name: subscriptions_user_id_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX subscriptions_user_id_idx ON public.subscriptions USING btree (user_id);


--
-- Name: user_preferences_user_id_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX user_preferences_user_id_idx ON public.user_preferences USING btree (user_id);


--
-- Name: user_preferences_user_id_key; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE UNIQUE INDEX user_preferences_user_id_key ON public.user_preferences USING btree (user_id);


--
-- Name: user_profiles_user_id_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX user_profiles_user_id_idx ON public.user_profiles USING btree (user_id);


--
-- Name: user_profiles_user_id_key; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE UNIQUE INDEX user_profiles_user_id_key ON public.user_profiles USING btree (user_id);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_stripe_customer_id_idx; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE INDEX users_stripe_customer_id_idx ON public.users USING btree (stripe_customer_id);


--
-- Name: users_stripe_customer_id_key; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE UNIQUE INDEX users_stripe_customer_id_key ON public.users USING btree (stripe_customer_id);


--
-- Name: users_stripe_subscription_id_key; Type: INDEX; Schema: public; Owner: moazzam
--

CREATE UNIQUE INDEX users_stripe_subscription_id_key ON public.users USING btree (stripe_subscription_id);


--
-- Name: analytics analytics_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.analytics
    ADD CONSTRAINT analytics_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: application_events application_events_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.application_events
    ADD CONSTRAINT application_events_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: applications applications_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: applications applications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: auth_log auth_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.auth_log
    ADD CONSTRAINT auth_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: educations educations_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.educations
    ADD CONSTRAINT educations_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: experiences experiences_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT experiences_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: jobs jobs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment_history payment_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT payment_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: resumes resumes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.resumes
    ADD CONSTRAINT resumes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_preferences user_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_profiles user_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: moazzam
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

