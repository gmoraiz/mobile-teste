SELECT p.*, m.DescricaoMontadora, v.DescricaoVeiculo, pv.ObsProdutoVeiculo 
  FROM produto_veiculo AS pv
    INNER JOIN produto AS p ON pv.CodigoProduto = p.CodigoProduto
    INNER JOIN veiculo AS v ON pv.CodigoVeiculo = v.CodigoVeiculo
    LEFT JOIN montadora AS m ON v.CodigoMontadora = m.CodigoMontadora
    ORDER BY v.DescricaoVeiculo = "MONZA" DESC, v.DescricaoVeiculo = "FOCUS" DESC, p.DescricaoProduto, m.DescricaoMontadora, v.DescricaoVeiculo;

SELECT p.*, v.DescricaoVeiculo
  FROM produto_veiculo AS pv
    INNER JOIN produto AS p ON pv.CodigoProduto = p.CodigoProduto
    INNER JOIN veiculo AS v ON pv.CodigoVeiculo = v.CodigoVeiculo
    LEFT JOIN montadora AS m ON v.CodigoMontadora = m.CodigoMontadora
		WHERE v.CodigoMontadora IS NULL;

SELECT m.DescricaoMontadora, COUNT(pv.CodigoProduto) AS QuantidadeProduto
  FROM produto_veiculo AS pv
    INNER JOIN veiculo AS v ON pv.CodigoVeiculo = v.CodigoVeiculo
    RIGHT JOIN montadora AS m ON v.CodigoMontadora = m.CodigoMontadora
		GROUP BY (m.CodigoMontadora);