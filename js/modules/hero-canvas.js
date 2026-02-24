/**
 * Hero Canvas Module
 * AI & Automation themed animation
 */

export function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let nodes = [];
    let connections = [];
    let dataParticles = [];
    let time = 0;

    // Configuration
    const config = {
        nodeCount: 25,
        maxConnections: 3,
        dataParticleSpeed: 2,
        nodeRadius: { min: 3, max: 8 },
        connectionDistance: 200,
        pulseSpeed: 0.02,
        colors: {
            primary: '#00e0ff',
            secondary: '#0066ff',
            accent: '#10b981',
            glow: 'rgba(0, 224, 255, 0.3)'
        }
    };

    /**
     * Node class representing AI neurons/processes
     */
    class Node {
        constructor() {
            this.reset();
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.type = Math.random() > 0.7 ? 'core' : 'process';
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.radius = config.nodeRadius.min + Math.random() * (config.nodeRadius.max - config.nodeRadius.min);
            this.connections = [];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.pulsePhase += config.pulseSpeed;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Keep in bounds
            this.x = Math.max(0, Math.min(canvas.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height, this.y));
        }

        draw() {
            const pulseRadius = this.radius + Math.sin(this.pulsePhase) * 2;
            const alpha = 0.6 + Math.sin(this.pulsePhase) * 0.3;

            // Outer glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, pulseRadius * 2, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, pulseRadius * 2
            );
            gradient.addColorStop(0, `rgba(0, 224, 255, ${alpha * 0.3})`);
            gradient.addColorStop(1, 'rgba(0, 224, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();

            // Core node
            ctx.beginPath();
            ctx.arc(this.x, this.y, pulseRadius, 0, Math.PI * 2);
            ctx.fillStyle = this.type === 'core' 
                ? config.colors.secondary 
                : config.colors.primary;
            ctx.fill();

            // Inner highlight
            ctx.beginPath();
            ctx.arc(this.x - pulseRadius * 0.3, this.y - pulseRadius * 0.3, pulseRadius * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.fill();
        }
    }

    /**
     * Data particle traveling between nodes
     */
    class DataParticle {
        constructor(startNode, endNode) {
            this.startNode = startNode;
            this.endNode = endNode;
            this.progress = 0;
            this.speed = config.dataParticleSpeed * (0.5 + Math.random() * 0.5);
            this.active = true;
        }

        update() {
            this.progress += this.speed / 100;
            if (this.progress >= 1) {
                this.active = false;
            }
        }

        draw() {
            const x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
            const y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;

            // Trail
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = config.colors.accent;
            ctx.fill();

            // Glow
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.5)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initNodes();
    }

    function initNodes() {
        nodes = [];
        const count = Math.min(config.nodeCount, Math.floor((canvas.width * canvas.height) / 30000));
        for (let i = 0; i < count; i++) {
            nodes.push(new Node());
        }
    }

    function findConnections() {
        connections = [];
        nodes.forEach((node, i) => {
            let nodeConnections = 0;
            nodes.slice(i + 1).forEach(otherNode => {
                if (nodeConnections >= config.maxConnections) return;
                
                const dx = node.x - otherNode.x;
                const dy = node.y - otherNode.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.connectionDistance) {
                    connections.push({
                        from: node,
                        to: otherNode,
                        distance: distance
                    });
                    nodeConnections++;
                }
            });
        });
    }

    function spawnDataParticle() {
        if (connections.length === 0) return;
        
        const connection = connections[Math.floor(Math.random() * connections.length)];
        const direction = Math.random() > 0.5;
        
        dataParticles.push(new DataParticle(
            direction ? connection.from : connection.to,
            direction ? connection.to : connection.from
        ));
    }

    function drawBackground() {
        // Dark gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(10, 15, 28, 1)');
        gradient.addColorStop(0.5, 'rgba(0, 40, 80, 0.2)');
        gradient.addColorStop(1, 'rgba(10, 15, 28, 1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid pattern (subtle)
        ctx.strokeStyle = 'rgba(0, 224, 255, 0.03)';
        ctx.lineWidth = 1;
        const gridSize = 50;
        
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    function drawConnections() {
        connections.forEach(conn => {
            const alpha = 1 - (conn.distance / config.connectionDistance);
            
            ctx.beginPath();
            ctx.moveTo(conn.from.x, conn.from.y);
            ctx.lineTo(conn.to.x, conn.to.y);
            
            // Gradient line
            const gradient = ctx.createLinearGradient(
                conn.from.x, conn.from.y,
                conn.to.x, conn.to.y
            );
            gradient.addColorStop(0, `rgba(0, 224, 255, ${alpha * 0.4})`);
            gradient.addColorStop(0.5, `rgba(0, 102, 255, ${alpha * 0.6})`);
            gradient.addColorStop(1, `rgba(0, 224, 255, ${alpha * 0.4})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        });
    }

    function animate() {
        time++;
        
        // Clear and draw background
        drawBackground();

        // Update and find connections
        nodes.forEach(node => node.update());
        findConnections();

        // Draw connections
        drawConnections();

        // Draw nodes
        nodes.forEach(node => node.draw());

        // Spawn data particles
        if (time % 30 === 0 && dataParticles.length < 15) {
            spawnDataParticle();
        }

        // Update and draw data particles
        dataParticles = dataParticles.filter(p => p.active);
        dataParticles.forEach(p => {
            p.update();
            p.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    // Initialize
    resize();
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        resize();
    });

    // Cleanup on visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}
