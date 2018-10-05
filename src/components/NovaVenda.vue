<template>
    <section class="section">
        <div class="container">
            <h1 class="title">
                Nova venda
            </h1>
            <hr>

            <article class="message is-success" v-if="exibir_mensagem_sucesso">
                <div class="message-header">
                    <p>Sucesso!</p>
                    <button class="delete" aria-label="delete" @click="exibir_mensagem_sucesso = false"></button>
                </div>
                <div class="message-body">
                    Venda inserida, ID: <strong>{{ id_inserido }}</strong>
                </div>
            </article>

            <div class="field">
                <label class="label">Nome do cliente</label>
                <div class="control">
                    <input class="input" type="text" v-model="nome_cliente" placeholder="Nome do clente">
                </div>
            </div>

            <br>

            <h4 class="title is-4">Adicionar produto</h4>
            <div class="columns">
                <div class="column">
                    <div class="field has-addons">
                        <div class="control is-expanded">
                            <label class="label">Produto</label>
                            <div class="select is-fullwidth">
                                <select name="country" v-model="novo_produto.produto_id">
                                    <option v-for="produto in produtos" 
                                    :key="produto.id" 
                                    :value="produto.id">{{produto.nome}}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="field">
                        <label class="label">Quantidade</label>
                        <div class="control">
                            <input class="input" type="text" 
                            v-model="novo_produto.quantidade"
                            @focus="$event.target.select()" 
                            placeholder="Quantidade">
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="field">
                        <label class="label">Valor por unidade</label>
                        <div class="control">
                            <input class="input" type="text" 
                            v-model="novo_produto.valor_unitario" 
                            @focus="$event.target.select()"
                            placeholder="Valor p/ un.">
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="field">
                        <label class="label">Valor total</label>
                        <div class="control">
                            <input class="input" type="text" :value="valor_total_novo_produto" placeholder="R$ 0,00" disabled>
                        </div>
                    </div>
                </div>
                <div class="column is-narrow">
                    <label class="label">&nbsp;</label>
                    <button class="button is-primary is-outlined" @click="adicionarProduto">Adicionar</button>
                </div>
            </div>
            
            <br>

            <h4 class="title is-4">Produtos {{quantidades_itens_venda}}</h4>
            <table class="table is-bordered is-fullwidth is-hoverable">
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Quantidade</th>
                        <th>Valor p/ un.</th>
                        <th>Valor Total</th>
                        <th style="width: 5%">Remover</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(produto, index) in produtos_venda" :key="index">
                        <td>{{nomeProduto(produto.produto_id)}}</td>
                        <td>{{produto.quantidade}}</td>
                        <td>R$ {{produto.valor_unitario}}</td>
                        <td>R$ {{produto.valor_unitario * produto.quantidade}}</td>
                        <td class="has-text-centered">
                            <button class="button is-danger is-outlined" @click="removerProdutoVenda(index)">
                                <span class="icon">
                                    <i class="fa fa-trash-o"></i>
                                </span>
                            </button>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th>Total</th>
                        <th>{{quantidade_total_venda}}</th>
                        <th>-</th>
                        <th>R$ {{valor_total_venda}}</th>
                        <th></th>
                    </tr>
                </tfoot>
            </table>

            <hr>
            <div>
                <button class="button is-link is-pulled-right" :class="{'is-loading': enviando}" @click="salvarVenda">Salvar</button>
            </div>
            
        </div>
    </section>  
</template>

<script>
export default {
  data() {
    return {
      nome_cliente: null,
      novo_produto: {
        produto_id: null,
        quantidade: 0,
        valor_unitario: 0
      },
      produtos: [],
      produtos_venda: [],
      enviando: false,
      exibir_mensagem_sucesso: false,
      id_inserido: null
    };
  },

  mounted() {
      this.buscarProdutos()
  },

  methods: {
    adicionarProduto() {
      this.produtos_venda.push(Object.assign({}, this.novo_produto));
      this.novo_produto.produto_id = null;
      this.novo_produto.quantidade = 0;
      this.novo_produto.valor_unitario = 0;
    },

    nomeProduto(id) {
        return this.produtos.find((produto) => produto.id === id).nome
    },
    
    removerProdutoVenda(index) {
        if(confirm('Tem certeza que deseja remover o produto?')) {
            this.produtos_venda.splice(index, 1)
        }
    },

    buscarProdutos() {
        axios.get(api_url + '/produtos').then((res) => {
            this.produtos = res.data.produtos
        })
    },

    salvarVenda() {
        let dados = {
            nome_cliente: this.nome_cliente,
            produtos: JSON.stringify(this.produtos_venda)
        }

        this.enviando = true

        axios.post(api_url + '/vendas', dados).then((res) => {

            this.enviando = false

            //Limpa as variaveis
            this.nome_cliente = ''
            this.produtos_venda = []
            this.novo_produto.produto_id = null;
            this.novo_produto.quantidade = 0;
            this.novo_produto.valor_unitario = 0;

            //Apresenta mensagem de sucesso            
            this.id_inserido = res.data.venda_id
            this.exibir_mensagem_sucesso = true

        }).catch((err) => {
            this.enviando = false
        })
    }
  },

  computed: {
    valor_total_novo_produto() {
      return this.novo_produto.quantidade * this.novo_produto.valor_unitario;
    },

    valor_total_venda() {
        return this.produtos_venda.reduce((carry, venda) => carry + venda.quantidade * venda.valor_unitario, 0)
    },

    quantidade_total_venda() {
        return this.produtos_venda.reduce((carry, venda) => carry + parseInt(venda.quantidade), 0)
    },

    quantidades_itens_venda() {
        if(this.produtos_venda.length <= 0) {
            return ''
        } else if (this.produtos_venda.length == 1) {
            return '- 1 item'
        } else {
            return '- ' + this.produtos_venda.length + ' itens'
        }
    }
  }
};
</script>

