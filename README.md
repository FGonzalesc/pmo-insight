# PMO Insight

Dashboard ejecutivo para control presupuestal del portafolio TI. El proyecto esta construido como un MVP profesional con Next.js, TypeScript y Tailwind CSS, usando data simulada local para representar proyectos, gastos OPEX/CAPEX, forecast, desviaciones y estados presupuestales.

## Objetivo

PMO Insight busca ayudar a una PMO, DPMO o equipo de Program Management a monitorear la ejecucion presupuestal de proyectos TI y detectar oportunamente riesgos de desviacion.

El dashboard responde preguntas clave:

- Cuanto presupuesto aprobado tiene el portafolio.
- Cuanto se ha ejecutado al mes de corte.
- Cual es el forecast de cierre.
- Que desviacion proyectada existe frente al presupuesto.
- Que proyectos no actualizaron informacion presupuestal.
- Que programas concentran mayor riesgo presupuestal.

## Funcionalidades del MVP

- Dashboard de una sola pagina, sin autenticacion ni backend.
- Filtros por programa, Project Manager, RGT, KR Banco, mes de corte y busqueda.
- KPIs financieros:
  - Presupuesto aprobado
  - Ejecutado acumulado
  - Forecast de cierre
  - Desviacion proyectada
- Panel de atencion requerida con alertas accionables:
  - Proyectos sin actualizacion del ultimo mes cerrado
  - Proyectos con forecast mayor al presupuesto aprobado
  - Proyectos con consumo mayor al 90%
  - Programa con mayor desviacion proyectada
- Graficos ejecutivos:
  - Presupuesto aprobado vs forecast por programa
  - Proyectos por estado presupuestal
  - Movimiento mensual CAPEX / OPEX
- Tabla paginada de proyectos, 5 registros por pagina.
- Estados presupuestales calculados automaticamente:
  - En control
  - Atencion
  - Alto riesgo
  - Critico

## Stack Tecnico

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React
- Datos simulados locales

## Estructura del Proyecto

```txt
app/
  globals.css
  layout.tsx
  page.tsx

src/
  components/
    dashboard/
      AttentionPanel.tsx
      Dashboard.tsx
      DashboardFilters.tsx
      DashboardHeader.tsx
      KpiGrid.tsx
      MonthlySpendChart.tsx
      PortfolioBudgetChart.tsx
      ProgramRiskChart.tsx
      ProjectsTable.tsx
    ui/
      Badge.tsx
      Button.tsx
      Card.tsx
      FormControls.tsx
  data/
    gastos.ts
    proyectos.ts
  hooks/
    usePortfolioFilters.ts
  services/
    portfolio-service.ts
  types/
    portfolio.ts
  utils/
    currency.ts
    dates.ts
    filters.ts
```

## Arquitectura

La aplicacion separa responsabilidades para facilitar crecimiento:

- `src/data`: contiene la data simulada de proyectos y gastos. No almacena metricas derivadas.
- `src/types`: define los contratos TypeScript del dominio presupuestal.
- `src/services`: centraliza calculos de negocio como ejecutado acumulado, CAPEX/OPEX, forecast, desviacion y estado presupuestal.
- `src/components/dashboard`: contiene las secciones funcionales del dashboard.
- `src/components/ui`: componentes visuales reutilizables.
- `src/utils`: helpers de formato, fechas y filtros.
- `src/hooks`: estado de filtros y comportamiento interactivo.

## Reglas de Calculo

El MVP no guarda valores derivados como ejecutado, forecast, desviacion o estado. Estos se calculan en tiempo de ejecucion a partir de proyectos y gastos.

Formula de forecast:

```txt
forecast = ejecutado acumulado + promedio mensual ejecutado * meses restantes hasta cierre
```

Estados presupuestales:

- `Critico`: sin actualizacion del ultimo mes cerrado o forecast mayor al presupuesto aprobado.
- `Alto riesgo`: ejecutado acumulado mayor al 90% del presupuesto.
- `Atencion`: ejecutado acumulado mayor al 75% o forecast cercano al presupuesto.
- `En control`: dentro de umbrales esperados.

## Como Ejecutar

Instalar dependencias:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Abrir:

```txt
http://localhost:3000
```

Validar calidad:

```bash
npm run lint
npm run build
```

## Potencial de Escalabilidad

Este MVP esta preparado para evolucionar hacia un producto mas completo:

- Integracion futura con Supabase o una API corporativa.
- Registro de nuevos gastos OPEX/CAPEX desde un panel lateral.
- Roles para PM, Program Manager, PMO y liderazgo ejecutivo.
- Historial de cambios presupuestales y auditoria.
- Carga de archivos Excel/CSV desde PMO.
- Alertas automaticas por falta de actualizacion.
- Simulaciones de forecast por escenarios.
- Vista por programa, sponsor, KR Banco o unidad organizacional.
- Exportacion de reportes ejecutivos.

## Estado Actual

El proyecto es un MVP frontend funcional con datos simulados. No incluye autenticacion, base de datos ni integraciones externas.
