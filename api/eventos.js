import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    if (req.method === 'GET') {
      // Buscar todos os eventos
      const { rows } = await pool.query('SELECT * FROM eventos ORDER BY dataEntrada DESC');
      return res.status(200).json(rows);
    }
    
    if (req.method === 'POST') {
      // Criar novo evento
      const evento = req.body;
      const { rows } = await pool.query(
        `INSERT INTO eventos (
          id, filial, placa, nome, tipoPessoa, tipoEvento, oficina,
          dataEntrada, dataSaida, maoObra, pecas, cota, numeroNegado,
          qtdVidros, valorVidros, qtdAcordos, valorAcordos, observacoes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *`,
        [
          evento.id, evento.filial, evento.placa, evento.nome,
          evento.tipoPessoa, evento.tipoEvento, evento.oficina,
          evento.dataEntrada, evento.dataSaida, evento.maoObra,
          evento.pecas, evento.cota, evento.numeroNegado,
          evento.qtdVidros, evento.valorVidros, evento.qtdAcordos,
          evento.valorAcordos, evento.observacoes
        ]
      );
      return res.status(201).json(rows[0]);
    }
    
    if (req.method === 'PUT') {
      // Atualizar evento existente
      const evento = req.body;
      const { rows } = await pool.query(
        `UPDATE eventos SET
          filial = $2, placa = $3, nome = $4, tipoPessoa = $5,
          tipoEvento = $6, oficina = $7, dataEntrada = $8, dataSaida = $9,
          maoObra = $10, pecas = $11, cota = $12, numeroNegado = $13,
          qtdVidros = $14, valorVidros = $15, qtdAcordos = $16,
          valorAcordos = $17, observacoes = $18
        WHERE id = $1
        RETURNING *`,
        [
          evento.id, evento.filial, evento.placa, evento.nome,
          evento.tipoPessoa, evento.tipoEvento, evento.oficina,
          evento.dataEntrada, evento.dataSaida, evento.maoObra,
          evento.pecas, evento.cota, evento.numeroNegado,
          evento.qtdVidros, evento.valorVidros, evento.qtdAcordos,
          evento.valorAcordos, evento.observacoes
        ]
      );
      return res.status(200).json(rows[0]);
    }
    
    if (req.method === 'DELETE') {
      // Deletar evento
      const { id } = req.query;
      await pool.query('DELETE FROM eventos WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Evento deletado com sucesso' });
    }
    
    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ error: error.message });
  } finally {
    await pool.end();
  }
}
