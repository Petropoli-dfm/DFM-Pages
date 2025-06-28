// Dados dos níveis
const niveis = [
    {"nivel": 1, "compra": 4000, "ganho": 500, "dias": 35},
    {"nivel": 2, "compra": 10000, "ganho": 1200, "dias": 35},
    {"nivel": 3, "compra": 15000, "ganho": 1600, "dias": 50},
    {"nivel": 4, "compra": 25000, "ganho": 4000, "dias": 50},
    {"nivel": 5, "compra": 30000, "ganho": 5000, "dias": 50},
    {"nivel": 6, "compra": 45000, "ganho": 6500, "dias": 50},
    {"nivel": 7, "compra": 50000, "ganho": 8000, "dias": 50},
    {"nivel": 8, "compra": 60000, "ganho": 11200, "dias": 40},
    {"nivel": 9, "compra": 100000, "ganho": 13500, "dias": 40},
    {"nivel": 10, "compra": 120000, "ganho": 14200, "dias": 40},
    {"nivel": 11, "compra": 130000, "ganho": 20000, "dias": 40}
];

// Variáveis globais
let userData = null;
let userNiveis = [];
let userTransacoes = [];

// Função para formatar valores em Kz
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA',
        minimumFractionDigits: 0
    }).format(valor);
}

// Função para formatar data
function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-AO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Função para verificar autenticação
function verificarAuth() {
    const token = localStorage.getItem('dfm_token');
    const user = localStorage.getItem('dfm_user');
    
    if (!token || !user) {
        window.location.href = '/login';
        return false;
    }
    
    try {
        userData = JSON.parse(user);
        return true;
    } catch (error) {
        localStorage.removeItem('dfm_token');
        localStorage.removeItem('dfm_user');
        window.location.href = '/login';
        return false;
    }
}

// Função para carregar dados do usuário
async function carregarDadosUsuario() {
    try {
        const token = localStorage.getItem('dfm_token');
        const response = await fetch('/api/perfil', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar dados');
        }

        const data = await response.json();
        userData = data.user;
        userNiveis = data.niveisAtivos || [];
        userTransacoes = data.transacoes || [];

        // Atualizar interface
        atualizarInterface();
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        mostrarNotificacao('Erro ao carregar dados do usuário', 'error');
    }
}

// Função para atualizar interface
function atualizarInterface() {
    // Atualizar saldo
    document.getElementById('balanceAmount').textContent = formatarMoeda(userData.saldo);
    document.getElementById('userBalance').textContent = `Saldo: ${formatarMoeda(userData.saldo)}`;
    
    // Atualizar número de níveis ativos
    document.getElementById('niveisAtivos').textContent = userNiveis.length;
    
    // Carregar níveis
    carregarNiveisAtivos();
    
    // Carregar transações
    carregarTransacoes();
}

// Função para carregar níveis ativos
function carregarNiveisAtivos() {
    const niveisGrid = document.getElementById('niveisGrid');
    niveisGrid.innerHTML = '';

    if (userNiveis.length === 0) {
        niveisGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #FFA500;">
                <i class="fas fa-info-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3>Nenhum nível ativo</h3>
                <p>Compre seu primeiro nível para começar a ganhar!</p>
                <button class="action-btn" onclick="showNiveisModal()">
                    <i class="fas fa-plus"></i> Comprar Nível
                </button>
            </div>
        `;
        return;
    }

    userNiveis.forEach(nivel => {
        const nivelInfo = niveis.find(n => n.nivel === nivel.nivel);
        const dataVencimento = new Date(nivel.data_vencimento);
        const hoje = new Date();
        const diasRestantes = Math.ceil((dataVencimento - hoje) / (1000 * 60 * 60 * 24));
        
        const nivelCard = document.createElement('div');
        nivelCard.className = 'nivel-card';
        
        nivelCard.innerHTML = `
            <div class="nivel-header">
                <div class="nivel-numero">Nível ${nivel.nivel}</div>
                <div class="nivel-status ${diasRestantes > 0 ? 'status-ativo' : 'status-vencido'}">
                    ${diasRestantes > 0 ? 'Ativo' : 'Vencido'}
                </div>
            </div>
            <div class="nivel-info">
                <div class="nivel-info-item">
                    <span class="nivel-info-label">Valor Compra:</span>
                    <span class="nivel-info-value">${formatarMoeda(nivel.valor_compra)}</span>
                </div>
                <div class="nivel-info-item">
                    <span class="nivel-info-label">Ganho Diário:</span>
                    <span class="nivel-info-value">${formatarMoeda(nivel.ganho_esperado)}</span>
                </div>
                <div class="nivel-info-item">
                    <span class="nivel-info-label">Data Compra:</span>
                    <span class="nivel-info-value">${formatarData(nivel.data_compra)}</span>
                </div>
                <div class="nivel-info-item">
                    <span class="nivel-info-label">Vencimento:</span>
                    <span class="nivel-info-value">${formatarData(nivel.data_vencimento)}</span>
                </div>
                ${diasRestantes > 0 ? `
                    <div class="nivel-info-item">
                        <span class="nivel-info-label">Dias Restantes:</span>
                        <span class="nivel-info-value">${diasRestantes} dias</span>
                    </div>
                ` : ''}
            </div>
        `;
        
        niveisGrid.appendChild(nivelCard);
    });
}

// Função para carregar transações
function carregarTransacoes() {
    const transacoesList = document.getElementById('transacoesList');
    transacoesList.innerHTML = '';

    if (userTransacoes.length === 0) {
        transacoesList.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #FFA500;">
                <i class="fas fa-history" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3>Nenhuma transação</h3>
                <p>Suas transações aparecerão aqui</p>
            </div>
        `;
        return;
    }

    userTransacoes.forEach(transacao => {
        const transacaoItem = document.createElement('div');
        transacaoItem.className = 'transacao-item';
        
        let iconClass = '';
        let iconBg = '';
        
        switch (transacao.tipo) {
            case 'deposito':
                iconClass = 'fas fa-plus';
                iconBg = 'icon-deposito';
                break;
            case 'saque':
                iconClass = 'fas fa-minus';
                iconBg = 'icon-saque';
                break;
            case 'ganho':
                iconClass = 'fas fa-coins';
                iconBg = 'icon-ganho';
                break;
            case 'bonus':
                iconClass = 'fas fa-gift';
                iconBg = 'icon-ganho';
                break;
        }
        
        const valorClass = transacao.tipo === 'deposito' || transacao.tipo === 'ganho' || transacao.tipo === 'bonus' 
            ? 'valor-positivo' : 'valor-negativo';
        
        transacaoItem.innerHTML = `
            <div class="transacao-info">
                <div class="transacao-icon ${iconBg}">
                    <i class="${iconClass}"></i>
                </div>
                <div class="transacao-details">
                    <h4>${transacao.tipo.charAt(0).toUpperCase() + transacao.tipo.slice(1)}</h4>
                    <p>${formatarData(transacao.data_transacao)}</p>
                    ${transacao.banco ? `<p>Banco: ${transacao.banco}</p>` : ''}
                </div>
            </div>
            <div class="transacao-valor ${valorClass}">
                ${transacao.tipo === 'deposito' || transacao.tipo === 'ganho' || transacao.tipo === 'bonus' ? '+' : '-'}${formatarMoeda(transacao.valor)}
            </div>
        `;
        
        transacoesList.appendChild(transacaoItem);
    });
}

// Funções de modal
function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Funções específicas dos modais
function showDepositoModal() {
    showModal('depositoModal');
}

function showSaqueModal() {
    showModal('saqueModal');
}

function showNiveisModal() {
    carregarNiveisDisponiveis();
    showModal('niveisModal');
}

function showReferralLink() {
    const link = `${window.location.origin}/registro?ref=${userData.linkConvite}`;
    document.getElementById('referralLink').value = link;
    showModal('referralModal');
}

// Função para carregar níveis disponíveis
function carregarNiveisDisponiveis() {
    const niveisDisponiveis = document.getElementById('niveisDisponiveis');
    niveisDisponiveis.innerHTML = '';

    niveis.forEach(nivel => {
        const nivelCard = document.createElement('div');
        nivelCard.className = 'nivel-card';
        nivelCard.style.marginBottom = '1rem';
        
        nivelCard.innerHTML = `
            <div class="nivel-header">
                <div class="nivel-numero">Nível ${nivel.nivel}</div>
                <button class="action-btn" onclick="comprarNivel(${nivel.nivel})">
                    Comprar por ${formatarMoeda(nivel.compra)}
                </button>
            </div>
            <div class="nivel-info">
                <div class="nivel-info-item">
                    <span class="nivel-info-label">Ganho Diário:</span>
                    <span class="nivel-info-value">${formatarMoeda(nivel.ganho)}</span>
                </div>
                <div class="nivel-info-item">
                    <span class="nivel-info-label">Duração:</span>
                    <span class="nivel-info-value">${nivel.dias} dias</span>
                </div>
                <div class="nivel-info-item">
                    <span class="nivel-info-label">Ganho Total:</span>
                    <span class="nivel-info-value">${formatarMoeda(nivel.ganho * nivel.dias)}</span>
                </div>
            </div>
        `;
        
        niveisDisponiveis.appendChild(nivelCard);
    });
}

// Função para comprar nível
async function comprarNivel(nivel) {
    try {
        const token = localStorage.getItem('dfm_token');
        const response = await fetch('/api/comprar-nivel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nivel })
        });

        const data = await response.json();

        if (response.ok) {
            mostrarNotificacao('Nível comprado com sucesso!', 'success');
            closeModal('niveisModal');
            carregarDadosUsuario(); // Recarregar dados
        } else {
            throw new Error(data.error);
        }

    } catch (error) {
        console.error('Erro ao comprar nível:', error);
        mostrarNotificacao(error.message || 'Erro ao comprar nível', 'error');
    }
}

// Função para copiar link de referência
function copiarLink() {
    const linkInput = document.getElementById('referralLink');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999);
    document.execCommand('copy');
    mostrarNotificacao('Link copiado para a área de transferência!', 'success');
}

// Função para mostrar notificações
function mostrarNotificacao(mensagem, tipo = 'info') {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.innerHTML = `
        <div class="notificacao-conteudo">
            <span>${mensagem}</span>
            <button onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Adicionar estilos se não existirem
    if (!document.getElementById('notificacao-styles')) {
        const style = document.createElement('style');
        style.id = 'notificacao-styles';
        style.textContent = `
            .notificacao {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255, 215, 0, 0.9);
                color: #000;
                padding: 1rem;
                border-radius: 8px;
                z-index: 10000;
                animation: slideIn 0.3s ease;
            }
            
            .notificacao-conteudo {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .notificacao button {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #000;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notificacao);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (notificacao.parentElement) {
            notificacao.remove();
        }
    }, 5000);
}

// Função para logout
function logout() {
    localStorage.removeItem('dfm_token');
    localStorage.removeItem('dfm_user');
    window.location.href = '/';
}

// Função para toggle do menu do usuário
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('active');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    if (!verificarAuth()) {
        return;
    }

    // Carregar dados iniciais
    carregarDadosUsuario();

    // Configurar formulários
    setupFormularios();

    // Fechar modais ao clicar fora
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // Fechar menu do usuário ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-menu')) {
            document.getElementById('userDropdown').classList.remove('active');
        }
    });
});

// Função para configurar formulários
function setupFormularios() {
    // Formulário de depósito
    document.getElementById('depositoForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const valor = document.getElementById('depositoValor').value;
        const file = document.getElementById('comprovanteFile').files[0];
        
        if (!file) {
            mostrarNotificacao('Por favor, selecione um comprovante', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('valor', valor);
        formData.append('comprovante', file);

        const submitBtn = this.querySelector('button[type="submit"]');
        const loading = document.getElementById('depositoLoading');
        
        submitBtn.disabled = true;
        loading.style.display = 'block';

        try {
            const token = localStorage.getItem('dfm_token');
            const response = await fetch('/api/deposito', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                mostrarNotificacao('Depósito solicitado com sucesso! Aguarde a confirmação.', 'success');
                closeModal('depositoModal');
                this.reset();
                carregarDadosUsuario();
            } else {
                throw new Error(data.error);
            }

        } catch (error) {
            console.error('Erro ao solicitar depósito:', error);
            mostrarNotificacao(error.message || 'Erro ao solicitar depósito', 'error');
        } finally {
            submitBtn.disabled = false;
            loading.style.display = 'none';
        }
    });

    // Formulário de saque
    document.getElementById('saqueForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const valor = document.getElementById('saqueValor').value;
        const banco = document.getElementById('saqueBanco').value;
        const conta = document.getElementById('saqueConta').value;

        const submitBtn = this.querySelector('button[type="submit"]');
        const loading = document.getElementById('saqueLoading');
        
        submitBtn.disabled = true;
        loading.style.display = 'block';

        try {
            const token = localStorage.getItem('dfm_token');
            const response = await fetch('/api/saque', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    valor: parseFloat(valor),
                    banco,
                    numeroConta: conta
                })
            });

            const data = await response.json();

            if (response.ok) {
                mostrarNotificacao('Solicitação de saque enviada com sucesso! Aguarde a confirmação.', 'success');
                closeModal('saqueModal');
                this.reset();
                carregarDadosUsuario();
            } else {
                throw new Error(data.error);
            }

        } catch (error) {
            console.error('Erro ao solicitar saque:', error);
            mostrarNotificacao(error.message || 'Erro ao solicitar saque', 'error');
        } finally {
            submitBtn.disabled = false;
            loading.style.display = 'none';
        }
    });

    // Preview do arquivo de comprovante
    document.getElementById('comprovanteFile').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const uploadDiv = this.parentElement;
        
        if (file) {
            uploadDiv.innerHTML = `
                <i class="fas fa-check-circle" style="color: #51cf66;"></i>
                <p>Arquivo selecionado: ${file.name}</p>
                <p style="font-size: 0.8rem; color: #FFA500;">Clique novamente para trocar</p>
            `;
        }
    });
}

// Verificar se há parâmetro de compra na URL
const urlParams = new URLSearchParams(window.location.search);
const comprarNivel = urlParams.get('comprar');
if (comprarNivel) {
    setTimeout(() => {
        showNiveisModal();
    }, 1000);
} 