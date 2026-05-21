import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.STORAGE_URL);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS eventos (
      id TEXT PRIMARY KEY,
      filial TEXT,
      nome TEXT,
      tipo_pessoa TEXT,
      tipo_evento TEXT,
      placa TEXT,
      oficina TEXT,
      data_entrada DATE,
      data_saida DATE,
      mao_obra NUMERIC DEFAULT 0,
      pecas NUMERIC DEFAULT 0,
      cota NUMERIC DEFAULT 0,
      numero_negado TEXT,
      qtd_vidros INT DEFAULT 0,
      valor_vidros NUMERIC DEFAULT 0,
      qtd_acordos INT DEFAULT 0,
      valor_acordos NUMERIC DEFAULT 0,
      observacoes TEXT,
      criado_em TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

export default async function handler(req, res) {
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
        filial: r.filial,
        nome: r.nome,
        tipoPessoa: r.tipo_pessoa,
        tipoEvento: r.tipo_evento,
        placa: r.placa,
        oficina: r.oficina,
        dataEntrada: r.data_entrada ? r.data_entrada.toISOString().slice(0,10) : '',
        dataSaida: r.data_saida ? r.data_saida.toISOString().slice(0,10) : '',
        maoObra: Number(r.mao_obra),
        pecas: Number(r.pecas),
        cota: Number(r.cota),
        numeroNegado: r.numero_negado,
        qtdVidros: Number(r.qtd_vidros),
        valorVidros: Number(r.valor_vidros),
        qtdAcordos: Number(r.qtd_acordos),
        valorAcordos: Number(r.valor_acordos),
        observacoes: r.observacoes
      }));
      return res.status(200).json(eventos);
    }

    if (req.method === 'POST') {
      const e = req.body;
      await sql`
        INSERT INTO eventos
          (id, filial, nome, tipo_pessoa, tipo_evento, placa, oficina, data_entrada, data_saida,
           mao_obra, pecas, cota, numero_negado, qtd_vidros, valor_vidros, qtd_acordos, valor_acordos, observacoes)
        VALUES
          (${e.id}, ${e.filial}, ${e.nome}, ${e.tipoPessoa}, ${e.tipoEvento}, ${e.placa}, ${e.oficina},
           ${e.dataEntrada || null}, ${e.dataSaida || null},
           ${e.maoObra}, ${e.pecas}, ${e.cota}, ${e.numeroNegado},
           ${e.qtdVidros}, ${e.valorVidros}, ${e.qtdAcordos}, ${e.valorAcordos}, ${e.observacoes})
      `;
      return res.status(201).json({ ok: true });
    }

    if (req.method === 'PUT') {
      const e = req.body;
      await sql`
        UPDATE eventos SET
          filial=${e.filial}, nome=${e.nome}, tipo_pessoa=${e.tipoPessoa}, tipo_evento=${e.tipoEvento},
          placa=${e.placa}, oficina=${e.oficina}, data_entrada=${e.dataEntrada || null},
          data_saida=${e.dataSaida || null}, mao_obra=${e.maoObra}, pecas=${e.pecas}, cota=${e.cota},
          numero_negado=${e.numeroNegado}, qtd_vidros=${e.qtdVidros}, valor_vidros=${e.valorVidros},
          qtd_acordos=${e.qtdAcordos}, valor_acordos=${e.valorAcordos}, observacoes=${e.observacoes}
        WHERE id=${e.id}
      `;
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM eventos WHERE id=${id}`;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
