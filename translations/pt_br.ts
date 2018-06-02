const common = {
  add: 'Adicionar',
  attendee: 'Participante',
  basic_details: 'Detalhes básicos',
  company: 'Empresa',
  description: 'Descrição',
  end_time: 'Hora de término',
  email: 'Email',
  title: 'Cargo',
  saved_successfully: 'Dados salvos com sucesso!',
  start_time: 'Hora de início',
};

export const texts = {
  attendees: {
    page_title: 'Participantes',
    page_description: 'Visualize, adicione, importe e exporte participantes do evento.',
    add: common.add,
  },
  create_attendee: {
    page_title: 'Participantes',
    page_description: 'Visualize, adicione, importe e exporte participantes do evento.',
    basic_details: common.basic_details,
    attendee_email: common.email,
    attendee_name: 'Nome do participante',
    attendee: common.attendee,
    attendee_company: common.company,
    attendee_title: common.title,
    attendee_description: common.description,
    add: common.add,
    saved_successfully: common.saved_successfully,
  },
  new_account: {
    page_title: 'Adicionar Conta',
    page_description: 'Inclua uma nova conta e selecione o nível de permissão do usuário.',
    add: common.add,
  },

  profile_edit: {
    page_title: 'Editar Perfil',
    page_description: 'Edite seu perfil, altere sua senha e descrição.',
    add: common.add,
  },
  edit_account: {
    page_title: 'Editar Conta',
    page_description: 'Edite um usuário existente.',
    add: common.add,
  },
  new_event: {
    page_title: 'Adicionar Evento',
    page_description: 'Inclua um evento para um cliente.',
    add: common.add,
  },
  create_event: {},
  create_session: {
    page_title: 'Cronograma',
    page_description: 'Adicione as sessões do seu evento, vincule palestrantes, organize dias e horários.',
    basic_details: common.basic_details,
    session_name: 'Nome da sessão',
    session_description: common.description,
    date: 'Data',
    start_time: common.start_time,
    end_time: common.end_time,
    attendees: 'Participantes',
    save: 'Salvar',
    saved_successfully: common.saved_successfully,
  },
  create_speaker: {
    page_title: 'Palestrantes',
    page_description: 'Visualize, adicione, importe e exporte palestrantes que estarão no evento.',
    basic_details: common.basic_details,
    speaker_email: common.email,
    speaker_name: 'Nome do palestrante',
    speaker: 'Palestrante',
    speaker_company: common.company,
    speaker_title: common.title,
    speaker_description: common.description,
    portfolio: 'Portfólio',
    name: 'Nome',
    link: 'Link',
    add: common.add,
    saved_successfully: common.saved_successfully,
  },
  dashboard: {
    page_title: 'BackOffice - Administração',
    page_description: 'Administra a plataforma, crie, edite e exclua contas,\n crie aplicativos e organize permissões',
  },
  dashboard_client: {
    page_title: 'Bem-vindo ao B3App',
    page_description: 'Gerencie com facilidade seu aplicativo de evento alterando informações, design e permissões de acesso.',
  },
  event_info: {
    page_title: 'Informações do evento',
    page_description: 'Adicione informações sobre o evento.',
    basic_details: common.basic_details,
    event_name: 'Nome do evento',
    event_url: 'URL do evento',
    event_site: 'Site do evento',
    select_event_language: 'Selecione o idioma do evento',
    english: 'Inglês',
    french: 'Francês',
    portuguese: 'Português',
    event_description: common.description,
    date_and_time: 'Data e hora',
    start_date: 'Data de início',
    end_date: 'Data de término',
    local: 'Local',
    place_name: 'Nome do local',
    place_address: 'Endereço do local',
    advanced: 'Avançado',
    support_email: 'Email de suporte',
    save: 'Salvar',
    saved_successfully: common.saved_successfully,
  },
  event_schedule: {
    page_title: 'Cronograma',
    page_description: 'Adicione as sessões do seu evento, vincule palestrantes, organize dias e horários.',
    add: common.add,
  },
  login: {
    email: common.email,
    invalid_email: 'Verifique o email digitado',
    password: 'Senha',
    forgot_password: 'Esqueceu sua senha?',
    sign_in: 'Entrar',
    login_error: 'Email ou senha inválidos',
  },
  register: {},
  session_info: {
    page_title: 'Informações da sessão',
    basic_details: common.basic_details,
    session_name: 'Nome da sessão',
    session_description: common.description,
    date: 'Data',
    start_time: common.start_time,
    end_time: common.end_time,
    attendees: 'Participantes',
    saved_successfully: common.saved_successfully,
  },
  speakers: {
    page_title: 'Palestrantes',
    page_description: 'Visualize, adicione, importe e exporte palestrantes que estarão no evento.',
    add: common.add,
    import_data: 'Importar dados',
    pick_file: 'Escolher arquivo',
    save: 'Salvar',
  },
};