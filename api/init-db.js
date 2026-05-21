import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    // Criar tabela de eventos se n\u00e3o existir
    await pool.query(`
      CREATE TABLE IF NOT EXISTS eventos (
        id VARCHAR(255) PRIMARY KEY,
        filial VARCHAR(50),
        placa VARCHAR(20),
        nome VARCHAR(255),
        tipoPessoa VARCHAR(50),
        tipoEvento VARCHAR(100),
        oficina VARCHAR(255),
        dataEntrada VARCHAR(50),
        dataSaida VARCHAR(50),
        maoObra DECIMAL(10, 2) DEFAULT 0,
        pecas DECIMAL(10, 2) DEFAULT 0,
        cota DECIMAL(10, 2) DEFAULT 0,
        numeroNegado VARCHAR(100),
        qtdVidros INTEGER DEFAULT 0,
        valorVidros DECIMAL(10, 2) DEFAULT 0,
        qtdAcordos INTEGER DEFAULT 0,
        valorAcordos DECIMAL(10, 2) DEFAULT 0,
        observacoes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    return res.status(200).json({
      success: true,
      message: 'Banco de dados inicializado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    await pool.end();
  }
}
