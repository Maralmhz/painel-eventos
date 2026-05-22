const { neon } = require('@neondatabase/serverless');

const dbUrl =
  process.env.STORAGE_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEON_DATABASE_URL;

const sql = neon(dbUrl);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS eventos (
      id TEXT PRIMARY KEY
    )
  `;
  const cols = [
    'ALTER TABLE eventos ADD COLUMN IF NOT EXISTS filial TEXT',
    'ALTER TABLE eventos ADD COLUMN IF NOT EXISTS nome TEXT',
    'ALTER TABLE eventos ADD COLUMN IF NOT EXISTS tipo_pessoa TEXT',
    'ALTER TABLE eventos ADD COLUMN IF NOT EXISTS tipo_evento TEXT',
    'ALTER TABLE eventos ADD COLUMN IF NOT EXISTS placa TEXT',
    'ALTER TABLE eventos ADD COLUMN IF NOT EXISTS oficina TEXT',
    'ALTER TABLE eventos ADD COLUMN IF NOT EXISTS data_entrada DATE',
    'ALTER TABLE eventos ADD COLUMN IF NOT EXISTS data_saida DATE',
    'ALTER TABLE eventos ADD COLUMN IF NOT EXISTS mao_obra NUMERIC DEFAULT 0',
    'ALTER TABLE eventos ADD COLUMN IF NOT EXISTS pecas NUMERIC DEFAULT 0',
    'ALTER TABLE eventos ADD COLUMN IF NOT EXISTS cota NUMERIC DEFAULT 0',
    'ALTER TABLE eventos ADD COLUMN IF NOT EXISTS numero_negado TEXT',
    'ALTER TABLE eventos ADD COLUMN IF NOT EXISTS qtd_vidros INT DEFAULT 0',
    'ALTER TABLE eventos ADD COLUMN IF NOT EXISTS valor_vidros NUMERIC DEFAULT 0',
    'ALTER TABLE eventos ADD COLUMN IF NOT EXISTS qtd_acordos INT DEFAULT 0',
    'ALTER TABLE eventos ADD COLUMN IF NOT EXISTS valor_acordos NUMERIC DEFAULT 0',
    'ALTER TABLE eventos ADD COLUMN IF NOT EXISTS observacoes TEXT',
    'ALTER TABLE eventos ADD COLUMN IF NOT EXISTS criado_em TIMESTAMPTZ DEFAULT NOW()'
  ];
  for (const col of cols) {
    await sql.unsafe(col);
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await ensureTable();

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM eventos ORDER BY criado_em DESC`;
      const eventos = rows.map(r => ({
        id: r.id,
        filial: r.filial || '',
        nome: r.nome || '',
        tipoPessoa: r.tipo_pessoa || '',
        tipoEvento: r.tipo_evento || '',
        placa: r.placa || '',
        oficina: r.oficina || '',
        dataEntrada: r.data_entrada ? new Date(r.data_entrada).toISOString().slice(0,10) : '',
        dataSaida: r.data_saida ? new Date(r.data_saida).toISOString().slice(0,10) : '',
        maoObra: Number(r.mao_obra || 0),
        pecas: Number(r.pecas || 0),
        cota: Number(r.cota || 0),
        numeroNegado: r.numero_negado || '',
        qtdVidros: Number(r.qtd_vidros || 0),
        valorVidros: Number(r.valor_vidros || 0),
        qtdAcordos: Number(r.qtd_acordos || 0),
        valorAcordos: Number(r.valor_acordos || 0),
        observacoes: r.observacoes || ''
      }));
      return res.status(200).json(eventos);
    }

    if (req.method === 'POST') {
      const e = req.body;
      await sql`
        INSERT INTO eventos
          (id, filial, nome, tipo_pessoa, tipo_evento, placa, oficina,
           data_entrada, data_saida, mao_obra, pecas, cota, numero_negado,
           qtd_vidros, valor_vidros, qtd_acordos, valor_acordos, observacoes)
        VALUES
          (${e.id}, ${e.filial || ''}, ${e.nome || ''}, ${e.tipoPessoa || ''},
           ${e.tipoEvento || ''}, ${e.placa || ''}, ${e.oficina || ''},
           ${e.dataEntrada || null}, ${e.dataSaida || null},
           ${e.maoObra || 0}, ${e.pecas || 0}, ${e.cota || 0},
           ${e.numeroNegado || ''}, ${e.qtdVidros || 0}, ${e.valorVidros || 0},
           ${e.qtdAcordos || 0}, ${e.valorAcordos || 0}, ${e.observacoes || ''})
        ON CONFLICT (id) DO NOTHING
      `;
      return res.status(201).json({ ok: true });
    }

    if (req.method === 'PUT') {
      const e = req.body;
      await sql`
        UPDATE eventos SET
          filial=${e.filial || ''}, nome=${e.nome || ''},
          tipo_pessoa=${e.tipoPessoa || ''}, tipo_evento=${e.tipoEvento || ''},
          placa=${e.placa || ''}, oficina=${e.oficina || ''},
          data_entrada=${e.dataEntrada || null}, data_saida=${e.dataSaida || null},
          mao_obra=${e.maoObra || 0}, pecas=${e.pecas || 0}, cota=${e.cota || 0},
          numero_negado=${e.numeroNegado || ''}, qtd_vidros=${e.qtdVidros || 0},
          valor_vidros=${e.valorVidros || 0}, qtd_acordos=${e.qtdAcordos || 0},
          valor_acordos=${e.valorAcordos || 0}, observacoes=${e.observacoes || ''}
        WHERE id=${e.id}
      `;
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM eventos WHERE id=${id}`;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Metodo nao permitido' });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
