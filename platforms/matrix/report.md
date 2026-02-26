# Matrix Assessment Report

## Setting up a Tuwunel Matrix homeserver

I chose to do the matrix task as it meant I would actually get to have a self-hosted matrix homeserver  (also a custom handle) which seemed more fun to me. Luckily I already have a VPS which I wasn't using and a domain so setup wasn't too time consuming. Whilst I initially wanted to use Synapse which seemed generally better than Tuwunel (+ more documentation), my free Oracle Cloud VPS (single-core 1GB ram) lowkey restricted me to using the more lightweight Tuwunel. This is good enough for now (and also made it easier to set up yay)

Firstly, I deleted and recreated that VPS since it had some random old projects that I didn't need and I wanted a clean instance anyway.

After reading some sources about matrix hosting ([Synapse Installation](https://element-hq.github.io/synapse/latest/setup/installation.html) and [Understanding Synapse Hosting](https://matrix.org/docs/older/understanding-synapse-hosting/)) I realised that I would need to use delegation of incoming federation traffic since I wanted to keep my GitHub Pages portfolio page on my TLD. Thus, I would have Tuwunel served on `matrix.bioluminescence.dev` with server name at `bioluminescence.dev`. However, I couldn't just serve the `.well-known` delegation files with a reverse proxy like nginx, which is standard recommendation in most guides I read.

Instead, I would need to serve them on my GitHub pages repo. However, I found out that GitHub Pages uses Jekyll to build sites, which would interfere with my plan. After some research, I found [this](https://musings.flak.is/gh-pages-matrix-well-known) mini blog post and the Jekyll [docs](https://jekyllrb.com/docs/structure/). Essentially, since Jekyll excludes directories starting with `.`, I would have to manually include the `.well-known` directory within a `_config.yml` file in the root of my repository. This worked, and when I tested the `bioluminescence.dev` domain with the Matrix Federation Tester, it was returning the correct DNS and host information.

So, with delegation with GitHub Pages set up and working, I could start setting up Tuwunel. I did this with their Docker image and compose file and the setup [guide](https://matrix-construct.github.io/tuwunel/deploying/docker.html). The guide provides three compose pathways for proxy setup: default, traefik and caddy. Initially, I tried to use the traefik-related compose files, however I struggled to get this to work whist testing it with the Federation Tester.

At this time, I remembered that I had to expose the ports `8448` and `443` on the VPS firewall, but even after doing this I was still getting no results. So, instead of solving the problem (boring), I avoided it by deleting the container and using the other compose pathway using caddy. This proved to be so much easier. I managed to get it set up and running first try, and it worked with the Federation Tester! (yayy)

Also, I messed up a little when setting up my account because I lowkey immediately forgot the password I entered to set up the admin account which was really smart of me. Subsequently, I had to delete the database docker volume and recreate the docker container and make sure to remember my password this time.

After all that was done, I had my working homeserver running on my root TLD which I could connect through in Element and send federated messages. And also my webpage was still working!

## Matrix Handle

`@bioluminescence:bioluminescence.dev`
