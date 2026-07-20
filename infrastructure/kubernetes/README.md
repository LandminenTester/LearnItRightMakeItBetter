# Kubernetes-Deployment (Topologie B)

Referenzarchitektur und Workload-Definitionen:
[docs/deployment/03-kubernetes.md](../../docs/deployment/03-kubernetes.md).

Die Kustomize-Basis in `base/` wird in **Phase 3** der
[Roadmap](../../docs/requirements/06-roadmap-milestones.md) ausgearbeitet (Deployments,
Migrate-Job, NetworkPolicies, Probes, Overlays für Staging/Produktion; Helm-Chart optional).
Bis dahin ist [Docker Compose](../docker/compose.prod.yml) der Referenz-Produktionsweg
(Topologie A).
