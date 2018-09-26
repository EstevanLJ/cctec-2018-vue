<template>
    <section class="section">
        <div class="container">
            <h1 class="title">
                Nova venda
            </h1>
            <hr>
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
                            <input class="input" type="text" v-model="novo_produto.quantidade" placeholder="Quantidade">
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="field">
                        <label class="label">Valor por unidade</label>
                        <div class="control">
                            <input class="input" type="text" v-model="novo_produto.valor_unitario" placeholder="Valor p/ un.">
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

            <h4 class="title is-4">Produtos - 2 itens</h4>
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
                <button class="button is-link is-pulled-right">Salvar</button>
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
      produtos: [
        {
          id: 1,
          nome: "Coca-cola"
        },
        {
          id: 2,
          nome: "Fruki Guaraná"
        },
        {
          id: 3,
          nome: "Fruki Limão"
        }
      ],
      produtos_venda: []
    };
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
        this.produtos_venda.splice(index, 1)
    },

    salvarVenda() {
        console.log({
            nome_cliente: this.nome_cliente,
            produtos: this.produtos
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
        return this.produtos_venda.length
    }
  }
};
</script>

