FROM ruby:3.2-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN gem install jekyll bundler

# Set up an isolated system directory for dependencies
WORKDIR /usr/src/app
RUN echo 'source "https://rubygems.org"' > Gemfile && \
    echo 'gem "jekyll"' >> Gemfile
RUN bundle install

# Set the final execution directory to your project mount path
WORKDIR /srv/jekyll

EXPOSE 4000

# Tell Bundler to use the Gemfile located in the isolated directory
ENV BUNDLE_GEMFILE=/usr/src/app/Gemfile

CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--watch", "--force_polling"]
