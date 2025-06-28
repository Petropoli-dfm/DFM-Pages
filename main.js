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

// Função para formatar valores em Kz
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA',
        minimumFractionDigits: 0
    }).format(valor);
}

// Função para carregar os níveis na página
function carregarNiveis() {
    const niveisGrid = document.getElementById('niveisGrid');
    if (!niveisGrid) return;

    niveisGrid.innerHTML = '';

    niveis.forEach((nivel, index) => {
        const nivelCard = document.createElement('div');
        nivelCard.className = 'nivel-card';
        nivelCard.style.animationDelay = `${index * 0.1}s`;

        nivelCard.innerHTML = `
            <div class="nivel-header">
                <div class="nivel-numero">Nível ${nivel.nivel}</div>
            </div>
            <div class="nivel-valores">
                <div class="nivel-valor">
                    <span>Valor de Compra:</span>
                    <span>${formatarMoeda(nivel.compra)}</span>
                </div>
                <div class="nivel-valor">
                    <span>Ganho Diário:</span>
                    <span>${formatarMoeda(nivel.ganho)}</span>
                </div>
                <div class="nivel-valor">
                    <span>Duração:</span>
                    <span>${nivel.dias} dias</span>
                </div>
                <div class="nivel-valor">
                    <span>Ganho Total:</span>
                    <span>${formatarMoeda(nivel.ganho * nivel.dias)}</span>
                </div>
            </div>
            <button class="nivel-btn" onclick="comprarNivel(${nivel.nivel})">
                Comprar Nível ${nivel.nivel}
            </button>
        `;

        niveisGrid.appendChild(nivelCard);
    });
}

// Função para comprar nível
function comprarNivel(nivel) {
    // Verificar se o usuário está logado
    const token = localStorage.getItem('dfm_token');
    if (!token) {
        alert('Por favor, faça login para comprar um nível.');
        window.location.href = '/login';
        return;
    }

    // Redirecionar para o dashboard para fazer a compra
    window.location.href = `/dashboard?comprar=${nivel}`;
}

// Função para navegação suave
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Função para menu mobile
function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
}

// Função para animações de scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.nivel-card, .step, .contato-item, .banco-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Função para verificar se há link de referência na URL
function verificarReferencia() {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    
    if (ref) {
        localStorage.setItem('dfm_referencia', ref);
    }
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
    
    document.body.appendChild(notificacao);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (notificacao.parentElement) {
            notificacao.remove();
        }
    }, 5000);
}

// Função para adicionar efeitos de hover nos cards
function setupHoverEffects() {
    const cards = document.querySelectorAll('.nivel-card, .contato-item, .banco-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Função para contador de estatísticas
function animarContadores() {
    const contadores = document.querySelectorAll('.stat h3');
    
    contadores.forEach(contador => {
        const valorFinal = parseInt(contador.textContent.replace(/\D/g, ''));
        const sufixo = contador.textContent.replace(/\d/g, '');
        let valorAtual = 0;
        const incremento = valorFinal / 50;
        
        const timer = setInterval(() => {
            valorAtual += incremento;
            if (valorAtual >= valorFinal) {
                valorAtual = valorFinal;
                clearInterval(timer);
            }
            contador.textContent = Math.floor(valorAtual) + sufixo;
        }, 50);
    });
}

// Função para verificar se o usuário está logado
function verificarLogin() {
    const token = localStorage.getItem('dfm_token');
    const navMenu = document.querySelector('.nav-menu');
    
    if (token && navMenu) {
        // Substituir botões de login/registro por link do dashboard
        const loginBtn = navMenu.querySelector('a[href="/login"]');
        const registroBtn = navMenu.querySelector('a[href="/registro"]');
        
        if (loginBtn && registroBtn) {
            loginBtn.href = '/dashboard';
            loginBtn.textContent = 'Dashboard';
            loginBtn.className = 'btn btn-primary';
            
            registroBtn.style.display = 'none';
        }
    }
}

// Função para adicionar efeitos de partículas no fundo
function setupParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.3';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Criar partículas
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Redimensionar canvas quando a janela for redimensionada
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DFM - Digital Financial Market carregado!');
    
    // Carregar níveis
    carregarNiveis();
    
    // Configurar funcionalidades
    setupSmoothScrolling();
    setupMobileMenu();
    setupScrollAnimations();
    setupHoverEffects();
    verificarReferencia();
    verificarLogin();
    
    // Adicionar partículas (opcional - pode ser removido se afetar performance)
    // setupParticles();
    
    // Animar contadores quando a seção sobre estiver visível
    const sobreSection = document.querySelector('.sobre');
    if (sobreSection) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animarContadores();
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(sobreSection);
    }
    
    // Adicionar CSS para notificações
    const style = document.createElement('style');
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
        
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.95);
            padding: 1rem;
            border-top: 1px solid rgba(255, 215, 0, 0.2);
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    `;
    document.head.appendChild(style);
});

// Exportar funções para uso em outras páginas
window.DFM = {
    niveis,
    formatarMoeda,
    comprarNivel,
    mostrarNotificacao,
    verificarLogin
}; 