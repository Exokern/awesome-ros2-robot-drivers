# Contributing

This repository curates ROS 2 driver repositories. It is not a place for marketing submissions, broad robotics resources, course lists, or unverified compatibility claims.

## Add Or Update An Entry

Open a pull request that updates both:

- `README.md`
- `data/index.json`

Before opening the pull request:

```bash
npm run validate
```

If the repository has a `robot_skill.yaml`, mention it in the pull request. If it does not, do not invent compatibility claims. Use upstream README, package files, releases, and official documentation as evidence.

## Entry Requirements

Entries should have:

- A public GitHub repository root URL.
- A clear ROS 2 driver, wrapper, bridge, hardware-interface, or controller role.
- A visible hardware target.
- Recent activity, or a specific reason to keep a slow-moving stable driver.
- A visible license or a `license: unknown` note.
- No claims that EXOKERN or this list has tested the driver on hardware.

## Out Of Scope

- Broad robotics courses, papers, and newsletters.
- General-purpose simulation libraries unless they are directly tied to driver bringup.
- Hosted app features, accounts, OAuth, uploads, or dashboards.
- Robot code execution, Docker builds, hardware tests, or installation automation.
- AI-generated bulk submissions without manual review.

## Relationship To Robot Skill Spec

For detailed compatibility metadata, use the EXOKERN Robot Skill Spec:

https://github.com/Exokern/robot-skill-spec

This list may link to upstream `robot_skill.yaml` files or curated overlays, but it does not redefine that schema.

